'use client';

import s from '../DatePicker.module.scss';
import { ClassNames, DayPicker, ModifiersClassNames } from 'react-day-picker';
import { CaptionLayout } from '../types';

type Props = {
  today: Date;
  selectedDay?: Date;
  onSelectAction: (day: Date) => void;
  onErrorAction: (error: string | null) => void;
  allowPastDates: boolean;
  dayPickerClassNames?: Partial<ClassNames>;
  dayPickerModifiersClassNames?: Partial<ModifiersClassNames>;
  captionLayout?: CaptionLayout;
  startMonth?: Date;
  endMonth?: Date;
  reverseYears?: boolean;
};
export const DatePickerMultipleMode = ({
  today,
  selectedDay,
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
  const validateDays = (day: Date) => {
    if (!allowPastDates) {
      onErrorAction('Error!!');
      onSelectAction(day);
    } else {
      onErrorAction?.(null);
      onSelectAction(day);
    }
  };

  const defaultClassNames: Partial<ClassNames> = {
    month: 'rdp-month',
    day_button: 'rdp-day_button',
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
      mode="single"
      selected={selectedDay}
      onSelect={(day) => {
        if (day) {
          validateDays(day);
        }
      }}
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
