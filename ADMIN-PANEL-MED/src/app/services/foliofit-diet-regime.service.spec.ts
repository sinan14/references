import { TestBed } from '@angular/core/testing';

import { FoliofitDietRegimeService } from './foliofit-diet-regime.service';

describe('FoliofitDietRegimeService', () => {
  let service: FoliofitDietRegimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitDietRegimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
