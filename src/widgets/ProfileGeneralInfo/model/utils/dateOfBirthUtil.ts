export const normalizeDateString = (value: string | null | undefined) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (!match) return value;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
};

export const parseDateString = (value: string | null | undefined) => {
  const normalized = normalizeDateString(value);
  if (!normalized) return undefined;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return undefined;
  return date;
};
