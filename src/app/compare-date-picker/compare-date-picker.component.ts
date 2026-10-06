import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompareCalendarHeader } from './compare-calendar-header.component';
import { compareDateClass } from './compare-date-class';
import { CompareVisibility } from './compare-visibility';

/** Value of the picker when `range` is on. */
export interface CompareDateRangeValue {
  start: Date | null;
  end: Date | null;
}

/**
 * Form control wrapping a stock Material datepicker / date range picker together with the
 * Compare day look (Compare row, header toggle, footer).
 *
 * - single date (default): the control value is `Date | null`
 * - `[range]="true"`: the control value is `{ start: Date | null; end: Date | null }`
 *
 * The value type is the native `Date` (use with `provideNativeDateAdapter()`).
 *
 * Works with reactive forms (`[formControl]`, `formControlName`) and `ngModel`. Material's own
 * validation errors (`matDatepickerParse`, ...) are surfaced on the outer control.
 */
@Component({
  selector: 'app-compare-date-picker',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CompareDatePicker), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => CompareDatePicker), multi: true },
  ],
  template: `
    @if (range()) {
      <mat-form-field>
        <mat-label>{{ label() }}</mat-label>
        <mat-date-range-input [rangePicker]="rangePicker" [formGroup]="rangeGroup">
          <input matStartDate formControlName="start" placeholder="Start" (blur)="onTouched()" />
          <input matEndDate formControlName="end" placeholder="End" (blur)="onTouched()" />
        </mat-date-range-input>
        <mat-datepicker-toggle matIconSuffix [for]="rangePicker" />
        <mat-date-range-picker
          #rangePicker
          panelClass="compare-calendar"
          [dateClass]="dateClass()"
          [calendarHeaderComponent]="header"
          (closed)="onTouched()"
        />
      </mat-form-field>
    } @else {
      <mat-form-field>
        <mat-label>{{ label() }}</mat-label>
        <input matInput [matDatepicker]="picker" [formControl]="single" (blur)="onTouched()" />
        <mat-datepicker-toggle matIconSuffix [for]="picker" />
        <mat-datepicker
          #picker
          panelClass="compare-calendar"
          [dateClass]="dateClass()"
          [calendarHeaderComponent]="header"
          (closed)="onTouched()"
        />
      </mat-form-field>
    }
  `,
})
export class CompareDatePicker implements ControlValueAccessor, Validator {
  private readonly adapter = inject<DateAdapter<Date>>(DateAdapter);
  private readonly visibility = inject(CompareVisibility);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Select a start/end range instead of a single date. */
  readonly range = input(false);
  readonly label = input('Date');

  protected readonly header = CompareCalendarHeader;
  protected readonly dateClass = computed(() =>
    compareDateClass(this.adapter, this.visibility.offset()),
  );

  protected readonly single = new FormControl<Date | null>(null);
  protected readonly rangeGroup = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  protected onTouched: () => void = () => {};
  private onChange: (value: Date | CompareDateRangeValue | null) => void = () => {};
  /** True while writeValue pushes into the inner controls: those changes must not echo outwards. */
  private writing = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    this.single.valueChanges
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((v) => !this.writing && this.onChange(v));
    this.rangeGroup.valueChanges
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(
        (v) => !this.writing && this.onChange({ start: v.start ?? null, end: v.end ?? null }),
      );
  }

  writeValue(value: Date | CompareDateRangeValue | null): void {
    // Events stay enabled so Material's form field / input refresh (label float, etc.);
    // `writing` stops them from echoing back to the outer control. Inner controls run their
    // validators before emitting, so `validate()` always sees current Material errors.
    this.writing = true;
    try {
      if (this.range()) {
        const v = value && typeof value === 'object' && 'start' in value ? value : null;
        this.rangeGroup.setValue({ start: v?.start ?? null, end: v?.end ?? null });
      } else {
        this.single.setValue(value instanceof Date ? value : null);
      }
    } finally {
      this.writing = false;
    }
    // OnPush: values written from outside must refresh the inner form field (label float, ...).
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: Date | CompareDateRangeValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    const opts = { emitEvent: false };
    for (const control of [this.single, this.rangeGroup]) {
      if (disabled) control.disable(opts);
      else control.enable(opts);
    }
    this.cdr.markForCheck();
  }

  validate(_: AbstractControl): ValidationErrors | null {
    const errors = this.range()
      ? { ...this.rangeGroup.controls.start.errors, ...this.rangeGroup.controls.end.errors }
      : { ...this.single.errors };
    return Object.keys(errors).length ? errors : null;
  }
}
