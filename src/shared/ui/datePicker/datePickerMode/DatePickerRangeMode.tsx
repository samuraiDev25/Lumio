'use client';
import { DateRange, DayPicker } from 'react-day-picker';
import s from '../DatePicker.module.scss';
import './DatePicker.global.scss';

type Props = {
  today: Date;
  selectedRange?: DateRange;
  onSelectAction: (range: DateRange | undefined) => void;
  onErrorAction: (error: string | null) => void;
};

export const DatePickerRangeMode = ({
  today,
  selectedRange,
  onSelectAction,
  onErrorAction,
}: Props) => {
  const validateRange = (range?: DateRange) => {
    if (!range?.from) {
      onErrorAction?.(null);
      return true;
    }

    if (!range.to) {
      onErrorAction?.(null);
      return true;
    }

    if (range.to < today) {
      onErrorAction?.('Error, select current month or last month');
      return false;
    }

    onErrorAction?.(null);
    return true;
  };

  const handleSelect = (range: DateRange | undefined) => {
    if (validateRange(range)) {
      onSelectAction(range);
    }
  };

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      numberOfMonths={1}
      weekStartsOn={1}
      showOutsideDays
      modifiers={{
        weekend: { dayOfWeek: [0, 6] },
        today: today,
      }}
      modifiersClassNames={{
        selected: s.selected,
        weekend: s.weekend,
      }}
      classNames={{
        month: 'rdp-month',
        button: 'rdp-day_button',
        day_range_start: 'rdp-range_start',
        day_range_end: 'rdp-range_end',
        day_range_middle: 'rdp-range_middle',
        nav_button_previous: 'rdp-button_previous',
        nav_button_next: 'rdp-button_next',
        table: 'rdp-month_grid',
      }}
    />
  );
};
