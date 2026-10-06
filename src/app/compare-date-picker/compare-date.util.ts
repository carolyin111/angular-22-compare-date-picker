import { DateAdapter } from '@angular/material/core';

export type CompareOffset = -1 | 0 | 1;

/** Returns the date that is shown as the "Compare day" for `date`. */
export function getCompareDate<D>(date: D, offset: CompareOffset, adapter: DateAdapter<D>): D {
  return offset === 0 ? date : adapter.addCalendarDays(date, offset);
}
