import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CompareOffset, getCompareDate } from './compare-date.util';

/**
 * Builds a `dateClass` function that tags every month-view cell with `cmp-<day>`,
 * where <day> is the day-of-month of its Compare date. `compare-calendar.scss`
 * turns that class into the second number under the date.
 * Pass the result as a NEW function whenever the offset changes so Material re-renders.
 */
export function compareDateClass<D>(
  adapter: DateAdapter<D>,
  offset: CompareOffset,
  extra?: MatCalendarCellClassFunction<D>,
): MatCalendarCellClassFunction<D> {
  return (date, view) => {
    const own = extra?.(date, view);
    if (view !== 'month') return own ?? '';
    const cmp = `cmp-${adapter.getDate(getCompareDate(date, offset, adapter))}`;
    return own ? [...toArray(own), cmp] : cmp;
  };
}

function toArray(v: NonNullable<ReturnType<MatCalendarCellClassFunction<unknown>>>): string[] {
  if (typeof v === 'string') return [v];
  if (Array.isArray(v)) return v;
  if (v instanceof Set) return [...v];
  return Object.keys(v).filter((k) => (v as Record<string, unknown>)[k]);
}
