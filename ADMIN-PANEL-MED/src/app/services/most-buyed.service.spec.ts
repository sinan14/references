import { TestBed } from '@angular/core/testing';

import { MostBuyedService } from './most-buyed.service';

describe('MostBuyedService', () => {
  let service: MostBuyedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostBuyedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
