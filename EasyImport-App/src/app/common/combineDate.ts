export const combineDate = (date: Date) => {
  if (date == null) {
    return;
  }

  const fullDate = new Date(date);
  const year = fullDate.getFullYear();
  const month = fullDate.getMonth();
  const day = fullDate.getDay();
  const dateString = `${day}-${month}-${year}`;

  return new Date(dateString);
};
