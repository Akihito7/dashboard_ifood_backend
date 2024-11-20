type GetMonthBoundary = {
  type : 'first' | 'last',
  date : string | Date
}

export function getMonthBoundary({type, date} : GetMonthBoundary){
  if(type === 'first'){
    const monthWithFirstDay = new Date(date);
    monthWithFirstDay.setDate(1);
    monthWithFirstDay.setUTCHours(0, 0, 0, 0);
    return monthWithFirstDay
  }
  else if (type === 'last') {
    const monthWithLastDay = new Date(date);
    monthWithLastDay.setMonth(new Date(date).getMonth() + 1);
    monthWithLastDay.setDate(0);
    monthWithLastDay.setUTCHours(23, 59, 59, 999);
    return monthWithLastDay
  }
}