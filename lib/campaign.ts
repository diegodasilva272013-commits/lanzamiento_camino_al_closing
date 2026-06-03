import Papa from 'papaparse';
import { normalizeCampaignPhone, sanitizeFirstName } from '@/lib/twilio';

export type PreparedCampaignContact = {
  rowNumber: number;
  contactId: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tags: string[];
};

export type PreparedCampaignResult = {
  contacts: PreparedCampaignContact[];
  summary: {
    totalRows: number;
    accepted: number;
    invalidPhone: number;
    excludedByTag: number;
    duplicates: number;
    truncated: number;
  };
};

const EXCLUDED_TAGS = ['hard_bounced', 'cancelado', 'rechazado_sistema_tino_udc', 'udc_agenda_cancelada'];

function getField(record: Record<string, string>, candidates: string[]) {
  for (const candidate of candidates) {
    const value = record[candidate];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function parseTags(raw: string) {
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function prepareCampaignContacts(csvText: string, limit: number, defaultCountryCode = '54'): PreparedCampaignResult {
  const parsed = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    throw new Error(parsed.errors[0]?.message ?? 'No pudimos leer el CSV.');
  }

  const seenPhones = new Set<string>();
  const contacts: PreparedCampaignContact[] = [];
  const summary = {
    totalRows: parsed.data.length,
    accepted: 0,
    invalidPhone: 0,
    excludedByTag: 0,
    duplicates: 0,
    truncated: 0,
  };

  parsed.data.forEach((record, index) => {
    const rawPhone = getField(record, ['Phone', 'Telefono', 'Teléfono', 'phone']);
    const tags = parseTags(getField(record, ['Tags', 'tags']));

    if (tags.some((tag) => EXCLUDED_TAGS.includes(tag))) {
      summary.excludedByTag += 1;
      return;
    }

    const phone = normalizeCampaignPhone(rawPhone, defaultCountryCode);
    if (!phone) {
      summary.invalidPhone += 1;
      return;
    }

    if (seenPhones.has(phone)) {
      summary.duplicates += 1;
      return;
    }

    seenPhones.add(phone);

    const firstName = sanitizeFirstName(getField(record, ['First Name', 'Nombre', 'nombre']));
    const lastName = getField(record, ['Last Name', 'Apellido', 'apellido']);
    const email = getField(record, ['Email', 'email']);
    const contactId = getField(record, ['Contact Id', 'contact_id', 'id']) || `row-${index + 2}`;

    contacts.push({
      rowNumber: index + 2,
      contactId,
      firstName,
      lastName,
      name: `${firstName}${lastName ? ` ${lastName}` : ''}`.trim(),
      phone,
      email,
      tags,
    });
  });

  summary.accepted = Math.min(contacts.length, limit);
  summary.truncated = Math.max(contacts.length - limit, 0);

  return {
    contacts: contacts.slice(0, limit),
    summary,
  };
}