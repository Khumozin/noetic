import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { appConfig } from './app.config';

describe('appConfig', () => {
  it('configures the router with the app routes', () => {
    TestBed.configureTestingModule({
      providers: appConfig.providers,
    });

    const router = TestBed.inject(Router);

    expect(router.config.some(route => route.path === '')).toBe(true);
  });
});
