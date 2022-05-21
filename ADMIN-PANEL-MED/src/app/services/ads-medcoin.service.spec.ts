import { TestBed } from '@angular/core/testing';

import { AdsMedcoinService } from './ads-medcoin.service';

describe('AdsMedcoinService', () => {
  let service: AdsMedcoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsMedcoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
