function monthDateBounds() {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const firstDayFormated =
    firstDay.getFullYear() +
    '-' +
    (firstDay.getMonth() + 1) +
    '-' +
    firstDay.getDate();

  const lastDayFormated =
    lastDay.getFullYear() +
    '-' +
    (lastDay.getMonth() + 1) +
    '-' +
    lastDay.getDate();

  return [firstDayFormated, lastDayFormated];
}

export default monthDateBounds;
