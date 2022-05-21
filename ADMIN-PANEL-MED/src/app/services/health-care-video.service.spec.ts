import { TestBed } from '@angular/core/testing';

import { HealthCareVideoService } from './health-care-video.service';

describe('HealthCareVideoService', () => {
  let service: HealthCareVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthCareVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
