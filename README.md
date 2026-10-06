# Angular Material datepicker with "Compare day"

A form-control date picker built on the stock Angular Material `mat-datepicker` /
`mat-date-range-picker`. Under every date of the calendar it shows a second row, the **Compare
day** (the previous day, the same day or the next day), so users can see the two dates side by
side. Everything else (range selection, month / year / multi-year views, keyboard navigation,
min/max, forms) stays Material's own.

Built with Angular 22 and Angular Material / CDK 22.

```
 ┌──────────────────────────────────────────┐
 │                     Show Compare  (●──)  │  header bar + divider
 ├──────────────────────────────────────────┤
 │ OCT 2026 ▾                        ‹   ›  │  Material's own header
 │          S    M    T    W    T    F    S  │
 │ Original                      1    2    3 │
 │ Compare   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  30    1    2 │  grey band: Compare day number,
 │                                         Fr │  red Fr / Sa / Su tag
 │ Original  4    5    6    7    8    9   10 │
 │ Compare   3    4    5    6    7    8    9 │
 │           Sa   Su                       Fr │
 ├──────────────────────────────────────────┤
 │ Origin Date:  2026/10/08 ~ 2026/10/23    │  footer
 │ Compare Date: 2026/10/07 ~ 2026/10/22    │
 └──────────────────────────────────────────┘
```

## What it adds to the calendar

- **Compare row** – each week has an `Original` row (Material's day circles) and a `Compare` row:
  one continuous light-grey band, starting at the `Compare` label, with the Compare day number.
- **Weekday tag** – when the Compare date is a Friday, Saturday or Sunday, a red `Fr` / `Sa` / `Su`
  is shown under its number.
- **Header bar** – a `Show Compare` toggle at the inline end, above Material's own header, with a
  divider. Turning it off restores the stock calendar (no Compare row, no footer).
- **Footer** – `Origin Date` and `Compare Date` for the current selection, as a single date or a
  `start ~ end` range. Only shown while Compare is on.
- **Range preview** – while a range is being picked, Material's dashed blue outline encloses both
  the Original and the Compare row. After the second click, Compare stays grey.
- Month names inside the day grid (`OCT`, `SEP`, ...) are hidden so every month looks the same; the
  header already shows the month.

The Compare offset is `-1` (previous day, default), `0` (same day) or `1` (next day).

## Quick start: the form control

```html
<app-compare-date-picker label="Single date" formControlName="single" />
<app-compare-date-picker label="Date range" [range]="true" formControlName="range" />
```

```ts
form = new FormGroup({
  single: new FormControl<Date | null>(null),                                // Date | null
  range: new FormControl<CompareDateRangeValue>({ start: null, end: null }), // { start, end }
});
```

1. Provide a date adapter, e.g. `provideNativeDateAdapter()` in `app.config.ts`.
2. Include the SCSS mixin in your **global** styles (the calendar renders in a CDK overlay):

   ```scss
   @use '@angular/material' as mat;
   @use 'app/compare-date-picker/compare-calendar' as cc;

   html { @include mat.theme((color: mat.$azure-palette, typography: Roboto, density: 0)); }
   @include cc.compare-calendar;
   ```
3. Use `<app-compare-date-picker>` as above.

Component API:

| | |
|---|---|
| `[range]` | `false` (default): value is `Date \| null`. `true`: value is `{ start: Date \| null; end: Date \| null }`. |
| `[label]` | Label of the form field. |
| Forms | `[formControl]`, `formControlName`, `ngModel`; `disable()` / `enable()` / `reset()` / `setValue()` work. |
| Validation | Material's own errors (e.g. `matDatepickerParse`) show up on the outer control. |
| Touched | Set on blur and when the calendar closes. |

The value type is the native `Date`, so use it with `provideNativeDateAdapter()`.

### Compare offset and the toggle

`CompareVisibility` (root service) holds the state shared by every picker, header and footer:

```ts
const visibility = inject(CompareVisibility);
visibility.offset.set(1);   // -1 | 0 | 1
visibility.show.set(false); // same as turning the header toggle off
```

The state is global, not per picker, and is not persisted.

## Using it on a stock picker

If you need your own `mat-datepicker` / `mat-date-range-picker` (e.g. inside an existing
`mat-form-field`), apply the three hooks yourself:

```ts
protected readonly header = CompareCalendarHeader;
protected readonly dateClass = computed(() => compareDateClass(this.adapter, this.visibility.offset()));
```

```html
<mat-datepicker
  #picker
  panelClass="compare-calendar"
  [dateClass]="dateClass()"
  [calendarHeaderComponent]="header"
/>
```

- `panelClass="compare-calendar"` switches the styles on.
- `compareDateClass(adapter, offset, extra?)` tags each month-view cell with `cmp-<day>` (the
  day-of-month of its Compare date) and `cmp-wd-fr|sa|su`; pass your own `dateClass` as `extra` to
  compose. Pass a **new** function whenever the offset changes so Material re-renders the cells.
  The header and footer read the offset from `CompareVisibility`, so drive both from the same
  `visibility.offset()`.
- `CompareCalendarHeader` provides the toggle bar and the footer. Without it you still get the
  Compare row, just no toggle and no footer.

## How it works

Material does not let you template calendar cells or swap the calendar (`MatDatepickerContent`
hard-codes `<mat-calendar>`), so the feature only uses supported hooks plus CSS:

1. **`dateClass`** adds `cmp-<day>` / `cmp-wd-*` classes to the day buttons.
2. **`panelClass`** scopes a global SCSS mixin that:
   - makes every cell taller and paints the grey band on the cell background,
   - renders the Compare number as the circle's `::after` and the weekday tag as the cell's
     `::after` (matched with `:has()`),
   - draws the `Original` / `Compare` labels in the first cell of each week,
   - stretches Material's dashed preview outline over the Compare row.
3. **`calendarHeaderComponent`** renders the toggle bar. The same component also contains the
   footer; the header is `display: contents` and `<mat-calendar>` is a flex column, so CSS `order`
   moves the footer below the day grid. (`mat-datepicker-actions` would also work as a footer slot
   but turns selection into "pending until Apply", which changes behaviour.)
4. The toggle sets `data-compare="on|off"` on the header; the mixin only applies while it is not
   `off`.

Customise with mixin parameters and CSS variables:

```scss
@include cc.compare-calendar(
  $label-width: 64px,   // space for the Original / Compare labels
  $chip-height: 26px,   // height of the Compare band
  $row-gap: 8px,        // gap under each band (keeps two weeks' dashed outlines apart)
  $outline-radius: 18px // end radius of the dashed range-preview outline
);
```

| CSS variable | Default | |
|---|---|---|
| `--compare-row-bg` | opaque light grey | Compare band background |
| `--compare-row-color` | `--mat-sys-on-surface-variant` | Compare number colour |
| `--compare-weekend-color` | `#d32f2f` | `Fr` / `Sa` / `Su` colour |

## Files

`src/app/compare-date-picker/`

| File | |
|---|---|
| `compare-date-picker.component.ts` | `<app-compare-date-picker>`: `ControlValueAccessor` + `Validator` wrapper |
| `compare-calendar-header.component.ts` | `CompareCalendarHeader`: toggle bar, divider, Material's header, footer |
| `compare-date-class.ts` | `compareDateClass()`: builds the `dateClass` function |
| `compare-date.util.ts` | `getCompareDate()` and the `CompareOffset` type |
| `compare-visibility.ts` | `CompareVisibility`: shared offset and on/off state |
| `compare-calendar.scss` | The `compare-calendar` mixin |

`src/app/app.ts` is a demo: a reactive form with a single and a range picker, a stock picker for
comparison, an offset selector and Disable / Reset buttons.

## Limitations

- The Compare number, weekday tag, labels and band are CSS only: visual, not in the accessibility
  tree (the footer text is, and is announced politely).
- The CSS relies on Material's internal class names (`mat-calendar-body-cell-content`,
  `mat-calendar-body-cell-preview`, ...), its default cell aspect ratio (the extra row height is
  computed from `7.142857%`) and `:has()`. Re-check after upgrading Material or changing the
  calendar size.
- `calendarHeaderComponent` can only hold one component: if you already have a custom header, merge
  the toggle bar and footer into it instead of using `CompareCalendarHeader`.
- Day cells outside the current month stay empty (Material does not render adjacent-month days).
- `Fr` / `Sa` / `Su` are fixed English abbreviations; the labels and footer text are English.
- The form control uses the native `Date` type; other date adapters (Moment, date-fns) would need
  the component made generic.
- The offset and the "Show Compare" state are global to the app, not per picker.

## Develop

```bash
npm install
npm start      # demo at http://localhost:4200
npm test
npm run build
```
