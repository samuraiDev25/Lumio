'use client';

import React, { useState } from 'react';
import { DateRange } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import s from './DatePicker.module.scss';
import 'react-day-picker/dist/style.css';
import { Calendar, CalendarOutline } from '@/shared/ui/icons';
import './datePickerMode/DatePicker.global.scss';
import { formatDate, formatRange } from './utilsDate';
import { DatePickerRangeMode } from './datePickerMode/DatePickerRangeMode';
import { DatePickerMultipleMode } from './datePickerMode/DatePickerMultipleMode';

type Mode = 'multiple' | 'range';
type DatePickerProps = {
  mode: Mode;
  disabled?: boolean;
};
export const DatePicker = ({ mode, disabled = false }: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedWeek, setSelectedWeek] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const handleMultipleSelect = (day: Date, week: Date[]) => {
    setSelectedDay(day);
    setSelectedWeek(week);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
  };
  return (
    <div className={s.wrapper}>
      <label className={s.label}>
        {mode === 'multiple' ? 'Date' : 'Date range'}
      </label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            className={`${s.input} ${error ? s.errorInput : ''}`}
            disabled={disabled}
          >
            {mode === 'multiple'
              ? formatDate(selectedDay)
              : formatRange(selectedRange)}
            <span className={s.icon}>
              {open ? <Calendar /> : <CalendarOutline />}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className={s.popover} sideOffset={0}>
            {open &&
              (mode === 'multiple' ? (
                <DatePickerMultipleMode
                  today={today}
                  selectedWeek={selectedWeek}
                  onSelect={handleMultipleSelect}
                  onError={setError}
                />
              ) : (
                <DatePickerRangeMode
                  today={today}
                  selectedRange={selectedRange}
                  onSelect={handleRangeSelect}
                  onError={setError}
                />
              ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <div className={s.errorText}>{error}</div>}
    </div>
  );
};
