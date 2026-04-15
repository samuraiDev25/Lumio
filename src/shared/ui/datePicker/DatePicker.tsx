'use client';

import React, { useState } from 'react';
import { ClassNames, DateRange, ModifiersClassNames } from 'react-day-picker';
import * as Popover from '@radix-ui/react-popover';
import s from './DatePicker.module.scss';
import 'react-day-picker/dist/style.css';
import { Calendar, CalendarOutline } from '@/shared/ui/icons';
import './datePickerMode/DatePicker.global.scss';
import { formatDate, formatRange } from './utilsDate';
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
  onChangeAction?: (value: Date | undefined) => void;
  rangeValue?: DateRange;
  onRangeChangeAction?: (value: DateRange | undefined) => void;
  errorMessage?: string | null;
  errorNode?: React.ReactNode;
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
  onChangeAction,
  rangeValue,
  onRangeChangeAction,
  errorMessage,
  errorNode,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [error, setError] = useState<string | null>(null);
  const displayError = errorMessage ?? error;
  const hasError = Boolean(displayError);
  const today = new Date();
  const isMultipleControlled = mode === 'multiple' && !!onChangeAction;
  const isRangeControlled = mode === 'range' && !!onRangeChangeAction;
  const effectiveSelectedDay = isMultipleControlled ? value : selectedDay;

  const effectiveSelectedRange = isRangeControlled ? rangeValue : selectedRange;

  const handleMultipleSelect = (day: Date) => {
    if (!isMultipleControlled) {
      setSelectedDay(day);
    }
    onChangeAction?.(day);
  };

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!isRangeControlled) {
      setSelectedRange(range);
    }
    onRangeChangeAction?.(range);
  };

  const wrapperClassName = [s.wrapper, className].filter(Boolean).join(' ');
  const resolvedLabelClassName = [s.label, labelClassName]
    .filter(Boolean)
    .join(' ');
  const resolvedInputClassName = [
    s.input,
    hasError ? s.errorInput : '',
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

  return (
    <div className={wrapperClassName}>
      <label className={resolvedLabelClassName}>{resolvedLabelTitle}</label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button className={resolvedInputClassName} disabled={disabled}>
            {mode === 'multiple'
              ? formatDate(effectiveSelectedDay)
              : formatRange(effectiveSelectedRange)}
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
                  selectedDay={effectiveSelectedDay}
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
                  selectedRange={effectiveSelectedRange}
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

      {hasError && (
        <div className={resolvedErrorClassName}>
          {errorNode ?? displayError}
        </div>
      )}
    </div>
  );
};
