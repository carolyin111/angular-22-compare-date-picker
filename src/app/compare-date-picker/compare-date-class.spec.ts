import { TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { compareDateClass } from './compare-date-class';

describe('compareDateClass', () => {
  TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
  const adapter = TestBed.inject<DateAdapter<Date>>(DateAdapter);

  it('tags month cells with the compare day', () => {
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'month')).toBe('cmp-30');
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 5), 'month')).toBe('cmp-4');
    expect(compareDateClass(adapter, 1)(new Date(2026, 4, 31), 'month')).toBe('cmp-1');
    expect(compareDateClass(adapter, 0)(new Date(2026, 4, 5), 'month')).toBe('cmp-5');
  });

  it('leaves year and multi-year views alone', () => {
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'year')).toBe('');
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'multi-year')).toBe('');
  });

  it('composes with a custom dateClass', () => {
    const fn = compareDateClass(adapter, -1, () => ({ weekend: true, hidden: false }));
    expect(fn(new Date(2026, 4, 5), 'month')).toEqual(['weekend', 'cmp-4']);
    const year = compareDateClass(adapter, -1, () => 'x');
    expect(year(new Date(2026, 4, 5), 'year')).toBe('x');
  });
});
