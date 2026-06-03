type TwilioApiMessage = {
  sid: string;
  body: string | null;
  status: string;
  from: string;
  to: string;
  direction: string;
  date_created: string | null;
  date_sent: string | null;
  error_code: number | null;
  error_message: string | null;
};

type TwilioMessageListResponse = {
  messages: TwilioApiMessage[];
};

export type TwilioThreadMessage = {
  sid: string;
  body: string;
  status: string;
  from: string;
  to: string;
  direction: string;
  inbound: boolean;
  contactPhone: string;
  occurredAt: string | null;
  errorCode: number | null;
  errorMessage: string | null;
};

export type TwilioThread = {
  contactPhone: string;
  latestAt: string | null;
  latestBody: string;
  unreadInboundCount: number;
  messages: TwilioThreadMessage[];
};

function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

  if (!accountSid || !authToken || !whatsappFrom) {
    throw new Error('Falta configuración de Twilio en variables de entorno.');
  }

  return { accountSid, authToken, whatsappFrom };
}

function getAuthHeader() {
  const { accountSid, authToken } = getTwilioConfig();
  return `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`;
}

async function twilioJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: getAuthHeader(),
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const data = (await res.json().catch(() => ({}))) as T & {
    message?: string;
  };

  if (!res.ok) {
    const message = (data as { message?: string }).message ?? `Twilio HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function getWhatsappSender() {
  return getTwilioConfig().whatsappFrom;
}

export function normalizeCampaignPhone(raw: string, defaultCountryCode = '54') {
  const source = String(raw ?? '')
    .trim()
    .replace(/\.0+$/, '');

  if (!source) {
    return null;
  }

  const hasPlus = source.startsWith('+');
  const digitsOnly = source.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }

  let normalizedDigits = digitsOnly;

  if (!hasPlus) {
    if (digitsOnly.length < 10) {
      const countryCode = defaultCountryCode.replace(/\D/g, '') || '54';
      let national = digitsOnly;
      if (national.startsWith('0')) national = national.slice(1);
      if (national.startsWith('15')) national = national.slice(2);
      normalizedDigits = `${countryCode}${national}`;
    }
  }

  if (normalizedDigits.length < 8 || normalizedDigits.length > 15) {
    return null;
  }

  return `+${normalizedDigits}`;
}

export function sanitizeFirstName(value: string | null | undefined) {
  const cleaned = String(value ?? '').trim();
  if (!cleaned) {
    return 'amigo';
  }

  return cleaned.split(/\s+/)[0] ?? 'amigo';
}

export async function listRecentWhatsappMessages(limit = 200) {
  const { accountSid, whatsappFrom } = getTwilioConfig();
  const url = new URL(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`);
  url.searchParams.set('PageSize', String(limit));

  const data = await twilioJson<TwilioMessageListResponse>(url.toString());
  return data.messages.filter((message) => message.from === whatsappFrom || message.to === whatsappFrom);
}

function buildThreadMessage(message: TwilioApiMessage, whatsappFrom: string): TwilioThreadMessage {
  const inbound = message.to === whatsappFrom;
  const contactPhone = inbound ? message.from : message.to;

  return {
    sid: message.sid,
    body: message.body ?? '',
    status: message.status,
    from: message.from,
    to: message.to,
    direction: message.direction,
    inbound,
    contactPhone,
    occurredAt: message.date_sent ?? message.date_created,
    errorCode: message.error_code,
    errorMessage: message.error_message,
  };
}

export function buildWhatsappThreads(messages: TwilioApiMessage[]) {
  const whatsappFrom = getWhatsappSender();
  const threads = new Map<string, TwilioThread>();

  for (const message of messages) {
    const item = buildThreadMessage(message, whatsappFrom);
    const existing = threads.get(item.contactPhone);

    if (!existing) {
      threads.set(item.contactPhone, {
        contactPhone: item.contactPhone,
        latestAt: item.occurredAt,
        latestBody: item.body,
        unreadInboundCount: item.inbound ? 1 : 0,
        messages: [item],
      });
      continue;
    }

    existing.messages.push(item);
    existing.latestAt =
      new Date(item.occurredAt ?? 0).getTime() > new Date(existing.latestAt ?? 0).getTime()
        ? item.occurredAt
        : existing.latestAt;
    if (existing.latestAt === item.occurredAt) {
      existing.latestBody = item.body;
    }
    if (item.inbound) {
      existing.unreadInboundCount += 1;
    }
  }

  return [...threads.values()]
    .map((thread) => ({
      ...thread,
      messages: [...thread.messages].sort(
        (a, b) => new Date(a.occurredAt ?? 0).getTime() - new Date(b.occurredAt ?? 0).getTime(),
      ),
    }))
    .sort((a, b) => new Date(b.latestAt ?? 0).getTime() - new Date(a.latestAt ?? 0).getTime());
}

export async function sendTemplateWhatsappMessage(params: {
  to: string;
  contentSid: string;
  contentVariables?: Record<string, string>;
}) {
  const { accountSid, whatsappFrom } = getTwilioConfig();
  const body = new URLSearchParams({
    From: whatsappFrom,
    To: `whatsapp:${params.to}`,
    ContentSid: params.contentSid,
  });

  if (params.contentVariables && Object.keys(params.contentVariables).length > 0) {
    body.set('ContentVariables', JSON.stringify(params.contentVariables));
  }

  return twilioJson<TwilioApiMessage>(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  );
}

export async function sendFreeformWhatsappMessage(params: { to: string; body: string }) {
  const { accountSid, whatsappFrom } = getTwilioConfig();
  const body = new URLSearchParams({
    From: whatsappFrom,
    To: `whatsapp:${params.to}`,
    Body: params.body,
  });

  return twilioJson<TwilioApiMessage>(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    },
  );
}