import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
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
});
