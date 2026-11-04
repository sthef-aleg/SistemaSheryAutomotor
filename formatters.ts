export function formatGs(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'Gs. 0';
  }
  const numeric = Math.round(Number(amount));
  return 'Gs. ' + numeric.toLocaleString('es-PY');
}

export function formatKm(km: number | string | undefined | null): string {
  if (km === undefined || km === null || isNaN(Number(km))) {
    return '0 km';
  }
  return Number(km).toLocaleString('es-PY') + ' km';
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function getWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  // Default to Paraguay country code +595 if not prefixed
  const fullPhone = cleanPhone.startsWith('595')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? '595' + cleanPhone.substring(1)
    : '595' + cleanPhone;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
}
