import { TestBed } from '@angular/core/testing';

import { MedcoinService } from './medcoin.service';

describe('MedcoinService', () => {
  let service: MedcoinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedcoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
