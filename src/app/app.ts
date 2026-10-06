import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { compareDateClass } from './compare-date-picker/compare-date-class';
import { CompareCalendarHeader } from './compare-date-picker/compare-calendar-header.component';
import { CompareOffset } from './compare-date-picker/compare-date.util';

@Component({
  selector: 'app-root',
  imports: [FormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Compare Date Picker</h1>
      <label>
        Compare offset
        <select [ngModel]="offset()" (ngModelChange)="offset.set($event)">
          <option [ngValue]="-1">-1 day</option>
          <option [ngValue]="0">same day</option>
          <option [ngValue]="1">+1 day</option>
        </select>
      </label>

      <div class="row">
        <mat-form-field>
          <mat-label>Single date</mat-label>
          <input matInput [matDatepicker]="single" />
          <mat-datepicker-toggle matIconSuffix [for]="single" />
          <mat-datepicker #single panelClass="compare-calendar" [dateClass]="dateClass()" [calendarHeaderComponent]="header" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Date range</mat-label>
          <mat-date-range-input [rangePicker]="range">
            <input matStartDate placeholder="Start" />
            <input matEndDate placeholder="End" />
          </mat-date-range-input>
          <mat-datepicker-toggle matIconSuffix [for]="range" />
          <mat-date-range-picker #range panelClass="compare-calendar" [dateClass]="dateClass()" [calendarHeaderComponent]="header" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Stock (unchanged)</mat-label>
          <input matInput [matDatepicker]="stock" />
          <mat-datepicker-toggle matIconSuffix [for]="stock" />
          <mat-datepicker #stock />
        </mat-form-field>
      </div>
    </main>
  `,
  styles: `
    main { padding: 24px; font-family: Roboto, sans-serif; }
    .row { display: flex; gap: 16px; margin-top: 16px; }
  `,
})
export class App {
  private readonly adapter = inject<DateAdapter<Date>>(DateAdapter);
  protected readonly header = CompareCalendarHeader;
  protected readonly offset = signal<CompareOffset>(-1);
  protected readonly dateClass = computed(() => compareDateClass(this.adapter, this.offset()));
}
