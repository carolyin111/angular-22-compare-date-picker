import { Injectable, signal } from '@angular/core';
import { CompareOffset } from './compare-date.util';

/**
 * Shared Compare state for every compare picker: whether the Compare row is shown and which
 * day it points at (-1 / 0 / +1). The header/footer read it, the app writes it.
 */
@Injectable({ providedIn: 'root' })
export class CompareVisibility {
  readonly show = signal(true);
  readonly offset = signal<CompareOffset>(-1);
}
