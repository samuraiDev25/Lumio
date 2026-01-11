'use client';

import s from '../DatePicker.module.scss';
import { DayPicker } from 'react-day-picker';
import React from 'react';
import { getWeekForDay } from '@/shared/ui/datePicker/utilsDate';

type Props = {
  today: Date;
  selectedWeek?: Date[];
  onSelectAction: (day: Date, week: Date[]) => void;
  onErrorAction: (error: string | null) => void;
};
export const DatePickerMultipleMode = ({
  today,
  selectedWeek = [],
  onSelectAction,
  onErrorAction,
}: Props) => {
  const validateDays = (day: Date, week: Date[]) => {
    const lastDayOfWeek = week[6];
    if (lastDayOfWeek <= today) {
      onErrorAction('Error!!');
      onSelectAction(day, week);
    } else {
      onErrorAction?.(null);
      onSelectAction(day, week);
    }
  };

  const handleDayClick = (day: Date) => {
    const week = getWeekForDay(day);
    validateDays(day, week);
  };

  const handleSelect = (value: Date[] | undefined) => {
    if (!value || value.length === 0) return;
    const day = value[0];
    const week = getWeekForDay(day);
    validateDays(day, week);
  };

  return (
    <DayPicker
      mode="multiple"
      selected={selectedWeek}
      onSelect={handleSelect}
      onDayClick={handleDayClick}
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
        nav_button_previous: 'rdp-button_previous',
        nav_button_next: 'rdp-button_next',
        table: 'rdp-table',
      }}
    />
  );
};
