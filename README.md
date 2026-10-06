# Angular Material datepicker with "Compare day"

Adds a second number (the *Compare day*) under every date of a stock Angular Material
`mat-datepicker` / `mat-date-range-picker` calendar, plus `Original` / `Compare` row labels on
the left. Everything else (range selection, month / year / multi-year views, keyboard
navigation, min/max, forms) stays Material's own.

Built with Angular 22 and Angular Material / CDK 22.

```
          ‹   May 2026   ›
         Su   Mo   Tu   We   Th   Fr   Sa
Original│    │    │    │    │    │  1 │  2 │
Compare │    │    │    │    │    │ 30 │  1 │
```

## How it works

Material does not let you template calendar cells, so the feature uses two supported hooks:

1. `dateClass` – `compareDateClass(adapter, offset)` tags each month-view cell with `cmp-<day>`,
   where `<day>` is the day-of-month of the Compare date (`date + offset`).
2. `panelClass="compare-calendar"` + a global SCSS mixin that renders the tag as a second number
   (`::after`) and adds the row labels.

`offset` is `-1` (previous day), `0` (same day) or `1` (next day).

## Use it in your project

Copy `src/app/compare-date-picker/` and include the mixin in your **global** styles (the calendar
renders in a CDK overlay):

```scss
@use 'app/compare-date-picker/compare-calendar' as cc;
@include cc.compare-calendar;
```

```ts
protected readonly dateClass = computed(() => compareDateClass(this.adapter, this.offset()));
```

```html
<mat-datepicker #picker panelClass="compare-calendar" [dateClass]="dateClass()" />
<mat-date-range-picker #range panelClass="compare-calendar" [dateClass]="dateClass()" />
```

Pass a **new** `dateClass` function whenever the offset changes so Material re-renders the cells.

## Form control component

`<app-compare-date-picker>` wraps the stock picker, the Compare look, the header toggle and the
footer into one reactive-forms control (`ControlValueAccessor` + `Validator`):

```html
<app-compare-date-picker label="Single date" formControlName="single" />
<app-compare-date-picker label="Date range" [range]="true" formControlName="range" />
```

```ts
form = new FormGroup({
  single: new FormControl<Date | null>(null),                       // single: Date | null
  range: new FormControl<CompareDateRangeValue>({ start: null, end: null }), // range: { start, end }
});
```

- Works with `[formControl]`, `formControlName` and `ngModel`; `disable()` / `reset()` are supported.
- Material's own validation errors (e.g. `matDatepickerParse`) show up on the outer control.
- The value type is the native `Date` (use `provideNativeDateAdapter()`).
- The Compare offset and the "Show Compare" state are shared through `CompareVisibility`
  (`visibility.offset.set(-1 | 0 | 1)`).

## Trade-offs

- The Compare number and labels are CSS pseudo-elements: visual only, not in the accessibility tree.
- The CSS relies on Material's internal class names (`mat-calendar-body-cell-content`, ...);
  re-check after upgrading Material.

## Develop

```bash
npm install
npm start      # demo at http://localhost:4200
npm test
npm run build
```
