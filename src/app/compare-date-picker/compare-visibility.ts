import { Injectable, signal } from '@angular/core';
import { CompareOffset } from './compare-date.util';

/**
 * Compare state: whether the Compare row is shown and which day it points at (-1 / 0 / +1).
 * `CompareDatePicker` provides its own instance (driven by its `offset` / `showCompare` inputs),
 * so every picker is independent; the header/footer inside the popup read that instance.
 * Used on a stock picker without a component-level provider, the root instance is shared.
 */
@Injectable({ providedIn: 'root' })
export class CompareVisibility {
  readonly show = signal(true);
  readonly offset = signal<CompareOffset>(-1);
}
