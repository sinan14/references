import { TestBed } from '@angular/core/testing';

import { PromoServiceService } from './promo-service.service';

describe('PromoServiceService', () => {
  let service: PromoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
