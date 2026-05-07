export const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
});

export const shortDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export const formatRelativeTime = (iso: string) => {
  const diffMinutes = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours < 24) return minutes > 0 ? `${hours} jam ${minutes} menit lalu` : `${hours} jam lalu`;

  const days = Math.floor(hours / 24);
  return days === 1 ? '1 hari lalu' : `${days} hari lalu`;
};
