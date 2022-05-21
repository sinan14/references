import { TestBed } from '@angular/core/testing';

import { HealthCareVideoCategoryService } from './health-care-video-category.service';

describe('HealthCareVideoCategoryService', () => {
  let service: HealthCareVideoCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthCareVideoCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
