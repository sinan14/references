import { TestBed } from '@angular/core/testing';

import { MedimallService } from './medimall.service';

describe('MedimallService', () => {
  let service: MedimallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedimallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
