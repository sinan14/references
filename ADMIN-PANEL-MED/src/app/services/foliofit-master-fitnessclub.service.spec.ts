import { TestBed } from '@angular/core/testing';

import { FoliofitMasterFitnessclubService } from './foliofit-master-fitnessclub.service';

describe('FoliofitMasterFitnessclubService', () => {
  let service: FoliofitMasterFitnessclubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitMasterFitnessclubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
