import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateRange, MatCalendar } from '@angular/material/datepicker';
import { CompareCalendarHeader } from './compare-calendar-header.component';
import { CompareVisibility } from './compare-visibility';

describe('CompareCalendarHeader', () => {
  function render() {
    TestBed.configureTestingModule({ providers: [provideNativeDateAdapter()] });
    const fixture = TestBed.createComponent(MatCalendar<Date>);
    fixture.componentRef.setInput('headerComponent', CompareCalendarHeader);
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
    expect(el.querySelector('app-compare-calendar-header')!.getAttribute('data-compare')).toBe('off');
  });

  it('lists the Origin and Compare dates in the footer', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const footer = () =>
      Array.from(el.querySelectorAll('.compare-footer-line'))
        .map((line) => Array.from(line.children).map((c) => c.textContent!.trim()).join(' '))
        .join(' | ');
    expect(footer()).toContain('Origin Date: —');

    fixture.componentRef.setInput('selected', new Date(2026, 9, 8));
    fixture.detectChanges();
    expect(footer()).toContain('Origin Date: 10/8/2026');
    expect(footer()).toContain('Compare Date: 10/7/2026');

    fixture.componentRef.setInput('selected', new DateRange(new Date(2026, 9, 1), new Date(2026, 9, 23)));
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
});
