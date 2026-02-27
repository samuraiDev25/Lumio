'use client';
import {
  ClassNames,
  DateRange,
  DayPicker,
  ModifiersClassNames,
} from 'react-day-picker';
import s from '../DatePicker.module.scss';
import './DatePicker.global.scss';
import { CaptionLayout } from '../types';
type Props = {
  today: Date;
  selectedRange?: DateRange;
  onSelectAction: (range: DateRange | undefined) => void;
  onErrorAction: (error: string | null) => void;
  allowPastDates: boolean;
  dayPickerClassNames?: Partial<ClassNames>;
  dayPickerModifiersClassNames?: Partial<ModifiersClassNames>;
  captionLayout?: CaptionLayout;
  startMonth?: Date;
  endMonth?: Date;
  reverseYears?: boolean;
};

export const DatePickerRangeMode = ({
  today,
  selectedRange,
  onSelectAction,
  onErrorAction,
  allowPastDates,
  dayPickerClassNames,
  dayPickerModifiersClassNames,
  captionLayout,
  startMonth,
  endMonth,
  reverseYears,
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

    if (!allowPastDates && range.to < today) {
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

  const defaultClassNames: Partial<ClassNames> = {
    month: 'rdp-month',
    day_button: 'rdp-day_button',
    range_start: 'rdp-range_start',
    range_end: 'rdp-range_end',
    range_middle: 'rdp-range_middle',
    button_previous: 'rdp-button_previous',
    button_next: 'rdp-button_next',
    month_grid: 'rdp-month_grid',
    dropdowns: 'rdp-dropdowns',
    dropdown: 'rdp-dropdown',
    dropdown_root: 'rdp-dropdown_root',
    months_dropdown: 'rdp-months_dropdown',
    years_dropdown: 'rdp-years_dropdown',
    caption_label: 'rdp-caption_label',
  };
  const defaultModifiersClassNames: ModifiersClassNames = {
    selected: s.selected,
    weekend: s.weekend,
  };
  const mergedModifiersClassNames: ModifiersClassNames = {
    ...defaultModifiersClassNames,
  };
  if (dayPickerModifiersClassNames) {
    for (const [key, value] of Object.entries(dayPickerModifiersClassNames)) {
      if (value) {
        mergedModifiersClassNames[key] = value;
      }
    }
  }

  return (
    <DayPicker
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      numberOfMonths={1}
      weekStartsOn={1}
      showOutsideDays
      captionLayout={captionLayout}
      startMonth={startMonth}
      endMonth={endMonth}
      reverseYears={reverseYears}
      modifiers={{
        weekend: { dayOfWeek: [0, 6] },
        today: today,
      }}
      modifiersClassNames={mergedModifiersClassNames}
      classNames={{ ...defaultClassNames, ...dayPickerClassNames }}
    />
  );
};
