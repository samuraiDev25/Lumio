'use client';

import React, { useEffect, useState } from 'react';
import {
  ClassNames,
  DateRange,
  ModifiersClassNames,
} from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import s from './DatePicker.module.scss';
import 'react-day-picker/dist/style.css';
import { Calendar, CalendarOutline } from '@/shared/ui/icons';
import './datePickerMode/DatePicker.global.scss';
import { formatDate, formatRange, getWeekForDay } from './utilsDate';
import { DatePickerRangeMode } from './datePickerMode/DatePickerRangeMode';
import { DatePickerMultipleMode } from './datePickerMode/DatePickerMultipleMode';
import { CaptionLayout } from './types';

type Mode = 'multiple' | 'range';
type DatePickerProps = {
  mode: Mode;
  disabled?: boolean;
  allowPastDates?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  popoverClassName?: string;
  errorClassName?: string;
  dayPickerClassNames?: Partial<ClassNames>;
  dayPickerModifiersClassNames?: Partial<ModifiersClassNames>;
  captionLayout?: CaptionLayout;
  startMonth?: Date;
  endMonth?: Date;
  reverseYears?: boolean;
  labelTitle?: string;
  value?: Date;
  onChange?: (value: Date | undefined) => void;
  rangeValue?: DateRange;
  onRangeChange?: (value: DateRange | undefined) => void;
};
export const DatePicker = ({
  mode,
  disabled = false,
  allowPastDates = false,
  className,
  inputClassName,
  labelClassName,
  popoverClassName,
  errorClassName,
  dayPickerClassNames,
  dayPickerModifiersClassNames,
  captionLayout,
  startMonth,
  endMonth,
  reverseYears,
  labelTitle,
  value,
  onChange,
  rangeValue,
  onRangeChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedWeek, setSelectedWeek] = useState<Date[]>([]);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const handleMultipleSelect = (day: Date, week: Date[]) => {
    setSelectedDay(day);
    setSelectedWeek(week);
    onChange?.(day);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    setSelectedRange(range);
    onRangeChange?.(range);
  };

  const wrapperClassName = [s.wrapper, className].filter(Boolean).join(' ');
  const resolvedLabelClassName = [s.label, labelClassName]
    .filter(Boolean)
    .join(' ');
  const resolvedInputClassName = [
    s.input,
    error ? s.errorInput : '',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');
  const resolvedPopoverClassName = [s.popover, popoverClassName]
    .filter(Boolean)
    .join(' ');
  const resolvedErrorClassName = [s.errorText, errorClassName]
    .filter(Boolean)
    .join(' ');
  const resolvedLabelTitle =
    labelTitle ?? (mode === 'multiple' ? 'Date' : 'Date range');

  useEffect(() => {
    if (mode !== 'multiple') return;
    if (value) {
      setSelectedDay(value);
      setSelectedWeek(getWeekForDay(value));
    } else {
      setSelectedDay(undefined);
      setSelectedWeek([]);
    }
  }, [mode, value]);

  useEffect(() => {
    if (mode !== 'range') return;
    if (rangeValue) {
      setSelectedRange(rangeValue);
    } else {
      setSelectedRange(undefined);
    }
  }, [mode, rangeValue]);

  return (
    <div className={wrapperClassName}>
      <label className={resolvedLabelClassName}>{resolvedLabelTitle}</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button className={resolvedInputClassName} disabled={disabled}>
            {mode === 'multiple'
              ? formatDate(selectedDay)
              : formatRange(selectedRange)}
            <span className={s.icon}>
              {open ? <Calendar /> : <CalendarOutline />}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={resolvedPopoverClassName}
            sideOffset={0}
            align="start"
          >
            {open &&
              (mode === 'multiple' ? (
                <DatePickerMultipleMode
                  today={today}
                  selectedWeek={selectedWeek}
                  onSelectAction={handleMultipleSelect}
                  onErrorAction={setError}
                  allowPastDates={allowPastDates}
                  dayPickerClassNames={dayPickerClassNames}
                  dayPickerModifiersClassNames={dayPickerModifiersClassNames}
                  captionLayout={captionLayout}
                  startMonth={startMonth}
                  endMonth={endMonth}
                  reverseYears={reverseYears}
                />
              ) : (
                <DatePickerRangeMode
                  today={today}
                  selectedRange={selectedRange}
                  onSelectAction={handleRangeSelect}
                  onErrorAction={setError}
                  allowPastDates={allowPastDates}
                  dayPickerClassNames={dayPickerClassNames}
                  dayPickerModifiersClassNames={dayPickerModifiersClassNames}
                  captionLayout={captionLayout}
                  startMonth={startMonth}
                  endMonth={endMonth}
                  reverseYears={reverseYears}
                />
              ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <div className={resolvedErrorClassName}>{error}</div>}
    </div>
  );
};
