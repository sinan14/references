import { TestBed } from '@angular/core/testing';

import { FoliofitFitnessClubService } from './foliofit-fitness-club.service';

describe('FoliofitFitnessClubService', () => {
  let service: FoliofitFitnessClubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitFitnessClubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
