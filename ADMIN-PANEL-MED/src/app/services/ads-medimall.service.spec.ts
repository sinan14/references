import { TestBed } from '@angular/core/testing';

import { AdsMedimallService } from './ads-medimall.service';

describe('AdsMedimallService', () => {
  let service: AdsMedimallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsMedimallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
