import { TestBed } from '@angular/core/testing';

import { FoliofitServiceService } from './foliofi-testi,bmi,health.service';

describe('FoliofitServiceService', () => {
  let service: FoliofitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
