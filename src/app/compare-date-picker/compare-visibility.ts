import { Injectable, signal } from '@angular/core';

/** Whether the Compare row is shown in the calendar. Shared by every compare picker. */
@Injectable({ providedIn: 'root' })
export class CompareVisibility {
  readonly show = signal(true);
}
