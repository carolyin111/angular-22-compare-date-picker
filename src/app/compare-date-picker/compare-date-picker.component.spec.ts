import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CompareDatePicker, CompareDateRangeValue } from './compare-date-picker.component';
import { CompareVisibility } from './compare-visibility';

@Component({
  imports: [ReactiveFormsModule, CompareDatePicker],
  template: `
    <app-compare-date-picker label="Single" [formControl]="single" />
    <app-compare-date-picker label="Range" [range]="true" [formControl]="range" [offset]="1" [showCompare]="false" />
  `,
})
class Host {
  single = new FormControl<Date | null>(null);
  range = new FormControl<CompareDateRangeValue>({ start: null, end: null });
}

describe('CompareDatePicker (form control)', () => {
  function setup() {
    TestBed.configureTestingModule({ imports: [Host], providers: [provideNativeDateAdapter()] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const inputs = Array.from(el.querySelectorAll('input')) as HTMLInputElement[];
    return { fixture, host: fixture.componentInstance, inputs };
  }

  function type(input: HTMLInputElement, text: string) {
    input.value = text;
    input.dispatchEvent(new Event('input'));
  }

  it('writes a single date from the form control into the input', () => {
    const { fixture, host, inputs } = setup();
    host.single.setValue(new Date(2026, 9, 8));
    fixture.detectChanges();
    expect(inputs[0].value).toBe('10/8/2026');
  });

  it('updates the single control when the user types a date', () => {
    const { host, inputs } = setup();
    type(inputs[0], '10/9/2026');
    expect(host.single.value).toEqual(new Date(2026, 9, 9));
  });

  it('writes a range from the form control into both inputs', () => {
    const { fixture, host, inputs } = setup();
    host.range.setValue({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 23) });
    fixture.detectChanges();
    expect(inputs[1].value).toBe('10/8/2026');
    expect(inputs[2].value).toBe('10/23/2026');
  });

  it('emits { start, end } when the user types a range', () => {
    const { host, inputs } = setup();
    type(inputs[1], '10/8/2026');
    type(inputs[2], '10/23/2026');
    expect(host.range.value).toEqual({ start: new Date(2026, 9, 8), end: new Date(2026, 9, 23) });
  });

  it('clears the inputs on reset', () => {
    const { fixture, host, inputs } = setup();
    host.single.setValue(new Date(2026, 9, 8));
    host.single.reset();
    fixture.detectChanges();
    expect(inputs[0].value).toBe('');
  });

  it('disables the inner inputs when the control is disabled', () => {
    const { fixture, host, inputs } = setup();
    host.single.disable();
    host.range.disable();
    fixture.detectChanges();
    expect(inputs.every((i) => i.disabled)).toBe(true);
    host.single.enable();
    fixture.detectChanges();
    expect(inputs[0].disabled).toBe(false);
  });

  it('surfaces Material parse errors on the outer control', () => {
    const { fixture, host, inputs } = setup();
    type(inputs[0], 'not a date');
    fixture.detectChanges();
    expect(host.single.errors).toEqual(expect.objectContaining({ matDatepickerParse: expect.anything() }));
  });

  it('gives every picker its own Compare state, driven by its inputs', () => {
    const { fixture } = setup();
    const [a, b] = fixture.debugElement
      .queryAll(By.directive(CompareDatePicker))
      .map((de) => de.injector.get(CompareVisibility));
    expect(a).not.toBe(b);
    expect([a.offset(), a.show()]).toEqual([-1, true]);
    expect([b.offset(), b.show()]).toEqual([1, false]);
  });
});
