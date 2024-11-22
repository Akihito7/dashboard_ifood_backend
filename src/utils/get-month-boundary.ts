type GetMonthBoundary = {
  type: 'first' | 'last',
  date: string | Date
};

export function getMonthBoundary({ type, date }: GetMonthBoundary) {
  const inputDate = new Date(date);

  if (type === 'first') {
    const monthWithFirstDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), 1));
    return monthWithFirstDay;
  } else if (type === 'last') {
    const monthWithLastDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth() + 1, 0, 23, 59, 59, 999));
    return monthWithLastDay; 
  }
}
