import { TestBed } from '@angular/core/testing';

import { AdsSeasonalOffersService } from './ads-seasonal-offers.service';

describe('AdsSeasonalOffersService', () => {
  let service: AdsSeasonalOffersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsSeasonalOffersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
