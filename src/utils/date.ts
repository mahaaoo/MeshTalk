interface DateUnits {
  days: string;
  hours: string;
  minutes: string;
  now: string;
}

export const dateToFromNow = (date: string, units: DateUnits): string => {
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
    return daysRound + " " + units.days;
  }

  const hours = dateDiff / 1000 / 60 / 60 - 24 * daysRound;
  const hoursRound = Math.floor(hours);

  if (hoursRound > 0) {
    return hoursRound + " " + units.hours;
  }

  const minutes = dateDiff / 1000 / 60 - 24 * 60 * daysRound - 60 * hoursRound;
  const minutesRound = Math.floor(minutes);

  if (minutesRound > 0) {
    return minutesRound + " " + units.minutes;
  }

  return units.now;
};
