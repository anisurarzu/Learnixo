export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60_000);
}

export function isExpired(date: Date | null | undefined): boolean {
  if (!date) return true;
  return date.getTime() < Date.now();
}

export function toIso(date: Date | null | undefined): string | null {
  return date ? date.toISOString() : null;
}
