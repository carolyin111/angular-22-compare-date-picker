import { TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { compareDateClass } from './compare-date-class';

describe('compareDateClass', () => {
  TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
  const adapter = TestBed.inject<DateAdapter<Date>>(DateAdapter);

  it('tags month cells with the compare day', () => {
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'month')).toEqual(['cmp-30']);
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 5), 'month')).toEqual(['cmp-4']);
    expect(compareDateClass(adapter, 1)(new Date(2026, 4, 31), 'month')).toEqual(['cmp-1']);
    expect(compareDateClass(adapter, 0)(new Date(2026, 4, 5), 'month')).toEqual(['cmp-5']);
  });

  it('adds a weekday class when the compare date is Fri/Sat/Sun', () => {
    // 2026-05-01 is a Friday; -1 -> Thu 4/30 (none), +1 -> Sat 5/2, 0 -> Fri
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'month')).toEqual(['cmp-30']);
    expect(compareDateClass(adapter, 1)(new Date(2026, 4, 1), 'month')).toEqual(['cmp-2', 'cmp-wd-sa']);
    expect(compareDateClass(adapter, 0)(new Date(2026, 4, 1), 'month')).toEqual(['cmp-1', 'cmp-wd-fr']);
    // -1 on Monday 5/4 -> Sunday 5/3
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 4), 'month')).toEqual(['cmp-3', 'cmp-wd-su']);
  });

  it('leaves year and multi-year views alone', () => {
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'year')).toEqual([]);
    expect(compareDateClass(adapter, -1)(new Date(2026, 4, 1), 'multi-year')).toEqual([]);
  });

  it('composes with a custom dateClass', () => {
    const fn = compareDateClass(adapter, -1, () => ({ weekend: true, hidden: false }));
    expect(fn(new Date(2026, 4, 5), 'month')).toEqual(['weekend', 'cmp-4']);
    const year = compareDateClass(adapter, -1, () => 'x');
    expect(year(new Date(2026, 4, 5), 'year')).toEqual(['x']);
  });
});
