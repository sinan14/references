import { TestBed } from '@angular/core/testing';

import { FoliofitNutriChartsService } from './foliofit-nutri-charts.service';

describe('FoliofitNutriChartsService', () => {
  let service: FoliofitNutriChartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitNutriChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
