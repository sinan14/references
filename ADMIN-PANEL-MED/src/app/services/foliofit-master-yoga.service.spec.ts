import { TestBed } from '@angular/core/testing';

import { FoliofitMasterYogaService } from './foliofit-master-yoga.service';

describe('FoliofitMasterYogaService', () => {
  let service: FoliofitMasterYogaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitMasterYogaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
