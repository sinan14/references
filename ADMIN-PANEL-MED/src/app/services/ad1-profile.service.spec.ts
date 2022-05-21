import { TestBed } from '@angular/core/testing';

import { Ad1ProfileService } from './ad1-profile.service';

describe('Ad1ProfileService', () => {
  let service: Ad1ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ad1ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
