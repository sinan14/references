import { TestBed } from '@angular/core/testing';

import { HealthTipService } from './health-tip.service';

describe('HealthTipService', () => {
  let service: HealthTipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthTipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
