import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatCalendarHeader } from '@angular/material/datepicker';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { CompareVisibility } from './compare-visibility';

/**
 * Calendar header for `[calendarHeaderComponent]`: a bar with a "Show Compare" toggle at the
 * inline end, on top of Material's regular header (period button + prev/next).
 * The `data-compare` attribute drives `compare-calendar.scss`: when it is `off`, the calendar
 * falls back to the stock look.
 */
@Component({
  selector: 'app-compare-calendar-header',
  imports: [MatCalendarHeader, MatDividerModule, MatSlideToggle],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  `,
  styles: `
    :host { display: block; }
    .compare-header-bar {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 8px 12px;
      font: var(--mat-sys-label-large);
    }
  `,
})
export class CompareCalendarHeader {
  protected readonly visibility = inject(CompareVisibility);
}
