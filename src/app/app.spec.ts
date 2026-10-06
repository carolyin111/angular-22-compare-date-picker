import { TestBed } from '@angular/core/testing';
import { provideNativeDateAdapter } from '@angular/material/core';
import { App } from './app';

describe('App', () => {
  it('should create the app', () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideNativeDateAdapter()] });
    expect(TestBed.createComponent(App).componentInstance).toBeTruthy();
  });
});
