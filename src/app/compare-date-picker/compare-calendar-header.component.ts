import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { DateRange, MatCalendar, MatCalendarHeader } from '@angular/material/datepicker';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { getCompareDate } from './compare-date.util';
import { CompareVisibility } from './compare-visibility';

/**
 * Calendar header for `[calendarHeaderComponent]`:
 *  - a bar with a "Show Compare" toggle at the inline end, on top of Material's regular header,
 *  - a footer (moved below the calendar with CSS `order`, see compare-calendar.scss) that lists
 *    the selected Origin date(s) and the matching Compare date(s).
 * The `data-compare` attribute drives `compare-calendar.scss`: when it is `off`, the calendar
 * falls back to the stock look.
 */
@Component({
  selector: 'app-compare-calendar-header',
  imports: [MatCalendarHeader, MatDividerModule, MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.Default,
  host: { '[attr.data-compare]': 'visibility.show() ? "on" : "off"' },
  template: `
    <div class="compare-header-bar">
      <mat-slide-toggle
        labelPosition="before"
        [checked]="visibility.show()"
        (change)="visibility.show.set($event.checked)"
      >
        Show Compare
      </mat-slide-toggle>
    </div>
    <mat-divider />
    <mat-calendar-header />

    <div class="compare-footer-wrap">
      <mat-divider />
      <div class="compare-footer" aria-live="polite">
        <div class="compare-footer-line">
          <span class="compare-footer-label">Origin Date:</span>
          <span>{{ originText() }}</span>
        </div>
        @if (visibility.show()) {
          <div class="compare-footer-line">
            <span class="compare-footer-label">Compare Date:</span>
            <span>{{ compareText() }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    /* The header's children become direct flex items of <mat-calendar> (see compare-calendar.scss),
       so the footer can be ordered below the calendar grid. */
    :host { display: contents; }
    .compare-header-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 8px 12px;
      font: var(--mat-sys-label-large);
    }
    .compare-footer-wrap { order: 1; }
    .compare-footer {
      padding: 8px 16px 12px;
      font: var(--mat-sys-body-small);
      color: var(--mat-sys-on-surface);
    }
    .compare-footer-line { display: flex; gap: 6px; line-height: 20px; }
    .compare-footer-label { font-weight: 500; color: var(--mat-sys-on-surface-variant); }
  `,
})
export class CompareCalendarHeader<D> {
  protected readonly visibility = inject(CompareVisibility);
  private readonly calendar = inject<MatCalendar<D>>(MatCalendar);
  private readonly adapter = inject<DateAdapter<D>>(DateAdapter);

  protected originText(): string {
    return this.format((d) => d);
  }

  protected compareText(): string {
    const offset = this.visibility.offset();
    return this.format((d) => getCompareDate(d, offset, this.adapter));
  }

  /** `2026/10/08`, `2026/10/08 ~ 2026/10/23` for a range, `—` when nothing is selected. */
  private format(map: (d: D) => D): string {
    const selected = this.calendar.selected;
    if (selected instanceof DateRange) {
      if (!selected.start) return '—';
      const end = selected.end ? this.fmt(map(selected.end)) : '…';
      return `${this.fmt(map(selected.start))} ~ ${end}`;
    }
    return selected ? this.fmt(map(selected as D)) : '—';
  }

  private fmt(d: D): string {
    const a = this.adapter;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${a.getYear(d)}/${pad(a.getMonth(d) + 1)}/${pad(a.getDate(d))}`;
  }
}
