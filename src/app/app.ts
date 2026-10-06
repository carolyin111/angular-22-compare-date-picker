import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CompareDatePicker,
  CompareDateRangeValue,
} from './compare-date-picker/compare-date-picker.component';
import { CompareOffset } from './compare-date-picker/compare-date.util';

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
        <select [ngModel]="offset()" (ngModelChange)="offset.set($event)">
          <option [ngValue]="-1">-1 day</option>
          <option [ngValue]="0">same day</option>
          <option [ngValue]="1">+1 day</option>
        </select>
      </label>

      <form class="row" [formGroup]="form">
        <app-compare-date-picker label="Single date" formControlName="single" [offset]="offset()" />
        <app-compare-date-picker
          label="Date range"
          [range]="true"
          formControlName="range"
          [offset]="offset()"
        />

        <mat-form-field>
          <mat-label>Stock (unchanged)</mat-label>
          <input matInput [matDatepicker]="stock" />
          <mat-datepicker-toggle matIconSuffix [for]="stock" />
          <mat-datepicker #stock />
        </mat-form-field>
      </form>

      <p>
        <button type="button" (click)="toggleDisabled()">
          {{ form.disabled ? 'Enable' : 'Disable' }}
        </button>
        <button type="button" (click)="form.reset()">Reset</button>
      </p>
      <pre>{{ form.value | json }}</pre>
      <pre>status: {{ form.status }}</pre>
    </main>
  `,
  styles: `
    main {
      padding: 24px;
      font-family: Roboto, sans-serif;
    }
    .row {
      display: flex;
      gap: 16px;
      margin-top: 16px;
    }
  `,
})
export class App {
  protected readonly offset = signal<CompareOffset>(-1);
  protected readonly form = new FormGroup({
    single: new FormControl<Date | null>(null),
    range: new FormControl<CompareDateRangeValue>({ start: null, end: null }),
  });

  protected toggleDisabled(): void {
    if (this.form.disabled) this.form.enable();
    else this.form.disable();
  }
}
