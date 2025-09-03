export function formatToH_i(time: string): string {
  if (!time) return '';

  const [hourStr, minuteStr] = time.split(':');

  if (!hourStr || !minuteStr) return '';

  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');

  return `${formattedHour}:${formattedMinute}`;
}
