import { TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { getCompareDate } from './compare-date.util';

describe('getCompareDate', () => {
  TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
  const adapter = TestBed.inject<DateAdapter<Date>>(DateAdapter);
  const day = (y: number, m: number, d: number) => adapter.getDate(getCompareDate(new Date(y, m - 1, d), -1, adapter));

  it('returns the previous day for offset -1, crossing month boundaries', () => {
    expect(day(2026, 5, 5)).toBe(4);
    expect(day(2026, 5, 1)).toBe(30);
    expect(day(2026, 3, 1)).toBe(28);
    expect(day(2028, 3, 1)).toBe(29);
    expect(day(2026, 1, 1)).toBe(31);
  });

  it('returns the next day for offset +1, crossing month boundaries', () => {
    const next = (y: number, m: number, d: number) => adapter.getDate(getCompareDate(new Date(y, m - 1, d), 1, adapter));
    expect(next(2026, 5, 5)).toBe(6);
    expect(next(2026, 5, 31)).toBe(1);
  });

  it('returns the same date for offset 0', () => {
    const d = new Date(2026, 4, 5);
    expect(getCompareDate(d, 0, adapter)).toBe(d);
  });
});
