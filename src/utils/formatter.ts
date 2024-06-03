export function formatDate(unixEpoch: number) {
  return new Intl.DateTimeFormat('id', {
    dateStyle: 'full',
  }).format(unixEpoch);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
}
