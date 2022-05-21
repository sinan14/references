import { TestBed } from '@angular/core/testing';

import { AdsPromotionsService } from './ads-promotions.service';

describe('AdsPromotionsService', () => {
  let service: AdsPromotionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsPromotionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
