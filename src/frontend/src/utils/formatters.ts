
export function formatToH_i(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  if (!hourStr || !minuteStr) return '';
  
  const hour = parseInt(hourStr, 10);
  return `${hour}:${minuteStr}`;
}
