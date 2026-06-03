export const ADMIN_COOKIE_NAME = 'difusion_admin';

export function hasAdminPassword() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdminPasswordValid(candidate: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return true;
  }

  return candidate === configured;
}

export function isAdminSession(cookieValue: string | undefined) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return true;
  }

  return cookieValue === configured;
}