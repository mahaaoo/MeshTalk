export const dateToFromNow = (date: string): string => {
  const dateNow = new Date();
  const dateEnd = Date.parse(date);
  const dateDiff = dateNow.getTime() - dateEnd;

  const days = dateDiff / 1000 / 60 / 60 / 24;
  const daysRound = Math.floor(days);

  if (daysRound > 30) {
    const nextDate = new Date(dateEnd);
    return `${nextDate.getFullYear()}-${
      nextDate.getMonth() + 1 < 10
        ? "0" + (nextDate.getMonth() + 1)
        : nextDate.getMonth() + 1
    }-${nextDate.getDate()}`;
  }

  if (daysRound > 0) {
    return daysRound + "天前";
  }

  const hours = dateDiff / 1000 / 60 / 60 - 24 * daysRound;
  const hoursRound = Math.floor(hours);

  if (hoursRound > 0) {
    return hoursRound + "小时前";
  }

  const minutes = dateDiff / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
  const minutesRound = Math.floor(minutes);

  if (minutesRound > 0) {
    return minutesRound + "分钟前";
  }

  return "刚刚";
};
