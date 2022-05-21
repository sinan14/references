import { TestBed } from '@angular/core/testing';

import { DriverLoginService } from './driver-login.service';

describe('DriverLoginService', () => {
  let service: DriverLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
