import { DateRange } from 'react-day-picker';

export const getWeekForDay = (date: Date): Date[] => {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const week = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    week.push(day);
  }
  return week;
};

export const getWeekRange = (date: Date): DateRange => {
  const start = new Date(date);
  start.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { from: start, to: end };
};

export const formatDate = (date?: Date) =>
  date ? date.toLocaleDateString('en-GB') : 'DD/MM/YYYY';

export const formatRange = (range?: DateRange) => {
  if (!range?.from) return 'DD/MM/YYYY - DD/MM/YYYY';
  if (range.to) {
    return `${formatDate(range.from)} – ${formatDate(range.to)}`;
  }
  return `${formatDate(range.from)} – ${formatDate(range.from)}`;
};
