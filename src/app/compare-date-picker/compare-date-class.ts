import {
  MatCalendarCellClassFunction,
  MatCalendarCellCssClasses,
} from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CompareOffset, getCompareDate } from './compare-date.util';

/** getDayOfWeek(): 0 = Sunday ... 6 = Saturday. */
const WEEKDAY_CLASS: Record<number, string> = { 5: 'cmp-wd-fr', 6: 'cmp-wd-sa', 0: 'cmp-wd-su' };

/**
 * Builds a `dateClass` function that tags every month-view cell with `cmp-<day>`,
 * where <day> is the day-of-month of its Compare date, plus `cmp-wd-fr|sa|su` when that
 * Compare date falls on a Friday, Saturday or Sunday. `compare-calendar.scss`
 * turns that class into the second number under the date.
 * Pass the result as a NEW function whenever the offset changes so Material re-renders.
 */
export function compareDateClass<D>(
  adapter: DateAdapter<D>,
  offset: CompareOffset,
  extra?: MatCalendarCellClassFunction<D>,
): MatCalendarCellClassFunction<D> {
  return (date, view) => {
    const classes = toArray(extra?.(date, view));
    if (view !== 'month') return classes;
    const compare = getCompareDate(date, offset, adapter);
    classes.push(`cmp-${adapter.getDate(compare)}`);
    const weekday = WEEKDAY_CLASS[adapter.getDayOfWeek(compare)];
    if (weekday) classes.push(weekday);
    return classes;
  };
}

function toArray(v: MatCalendarCellCssClasses | undefined): string[] {
  if (!v) return [];
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return [...v];
  if (v instanceof Set) return [...v];
  return Object.keys(v).filter((k) => (v as Record<string, unknown>)[k]);
}
