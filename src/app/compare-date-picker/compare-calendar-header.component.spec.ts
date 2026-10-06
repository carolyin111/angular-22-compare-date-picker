import { TestBed } from '@angular/core/testing';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { DateRange, MatCalendar } from '@angular/material/datepicker';
import { CompareCalendarHeader } from './compare-calendar-header.component';
import { compareDateClass } from './compare-date-class';
import { CompareVisibility } from './compare-visibility';

describe('CompareCalendarHeader', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] }));

  function render(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(MatCalendar<Date>);
    fixture.componentRef.setInput('headerComponent', CompareCalendarHeader);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture;
  }

  it('shows a "Show Compare" toggle above the stock header, on by default', () => {
    const el = render().nativeElement as HTMLElement;
    const host = el.querySelector('app-compare-calendar-header')!;
    expect(host.getAttribute('data-compare')).toBe('on');
    expect(host.querySelector('.compare-header-bar')?.textContent).toContain('Show Compare');
    expect(host.querySelector('mat-calendar-header')).toBeTruthy();
  });

  it('turns Compare off when the toggle is switched', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    (el.querySelector('mat-slide-toggle button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(TestBed.inject(CompareVisibility).show()).toBe(false);
    expect(el.querySelector('app-compare-calendar-header')!.getAttribute('data-compare')).toBe(
      'off',
    );
  });

  it('lists the Origin and Compare dates in the footer', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const footer = () =>
      Array.from(el.querySelectorAll('.compare-footer-line'))
        .map((line) =>
          Array.from(line.children)
            .map((c) => c.textContent!.trim())
            .join(' '),
        )
        .join(' | ');
    expect(footer()).toContain('Origin Date: —');

    fixture.componentRef.setInput('selected', new Date(2026, 9, 8));
    fixture.detectChanges();
    expect(footer()).toContain('Origin Date: 10/8/2026');
    expect(footer()).toContain('Compare Date: 10/7/2026');

    fixture.componentRef.setInput(
      'selected',
      new DateRange(new Date(2026, 9, 1), new Date(2026, 9, 23)),
    );
    fixture.detectChanges();
    expect(footer()).toContain('Origin Date: 10/1/2026 ~ 10/23/2026');
    expect(footer()).toContain('Compare Date: 9/30/2026 ~ 10/22/2026');
  });

  it('hides the whole footer when Compare is off', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.compare-footer')).toBeTruthy();
    TestBed.inject(CompareVisibility).show.set(false);
    fixture.detectChanges();
    expect(el.querySelector('.compare-footer')).toBeNull();
    expect(el.querySelector('.compare-footer-wrap')).toBeNull();
  });

  it('re-renders the month cells when the offset changes while the calendar is open', () => {
    const adapter = TestBed.inject<DateAdapter<Date>>(DateAdapter);
    const visibility = TestBed.inject(CompareVisibility);
    const fixture = render({
      startAt: new Date(2026, 9, 1),
      dateClass: compareDateClass(adapter, -1),
    });
    const cellFor = (day: number) =>
      Array.from(
        fixture.nativeElement.querySelectorAll(
          '.mat-calendar-body-cell',
        ) as NodeListOf<HTMLElement>,
      ).find(
        (c) =>
          c.querySelector('.mat-calendar-body-cell-content')?.textContent?.trim() === String(day),
      )!;
    expect(cellFor(8).classList).toContain('cmp-7');

    visibility.offset.set(1);
    fixture.componentRef.setInput('dateClass', compareDateClass(adapter, 1));
    fixture.detectChanges();
    expect(cellFor(8).classList).toContain('cmp-9');
    expect(cellFor(8).classList).not.toContain('cmp-7');
  });
});
