import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CompareDatePicker,
  CompareDateRangeValue,
} from './compare-date-picker/compare-date-picker.component';
import { CompareVisibility } from './compare-date-picker/compare-visibility';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CompareDatePicker,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <h1>Compare Date Picker</h1>
      <label>
        Compare offset
        <select [ngModel]="visibility.offset()" (ngModelChange)="visibility.offset.set($event)">
          <option [ngValue]="-1">-1 day</option>
          <option [ngValue]="0">same day</option>
          <option [ngValue]="1">+1 day</option>
        </select>
      </label>

      <form class="row" [formGroup]="form">
        <app-compare-date-picker label="Single date" formControlName="single" />
        <app-compare-date-picker label="Date range" [range]="true" formControlName="range" />

        <mat-form-field>
          <mat-label>Stock (unchanged)</mat-label>
          <input matInput [matDatepicker]="stock" />
          <mat-datepicker-toggle matIconSuffix [for]="stock" />
          <mat-datepicker #stock />
        </mat-form-field>
      </form>

      <p>
        <button type="button" (click)="toggleDisabled()">{{ form.disabled ? 'Enable' : 'Disable' }}</button>
        <button type="button" (click)="form.reset()">Reset</button>
      </p>
      <pre>{{ form.value | json }}</pre>
      <pre>status: {{ form.status }}</pre>
    </main>
  `,
  styles: `
    main { padding: 24px; font-family: Roboto, sans-serif; }
    .row { display: flex; gap: 16px; margin-top: 16px; }
  `,
})
export class App {
  protected readonly visibility = inject(CompareVisibility);
  protected readonly form = new FormGroup({
    single: new FormControl<Date | null>(null),
    range: new FormControl<CompareDateRangeValue>({ start: null, end: null }),
  });

  protected toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }
}
