import { TestBed } from '@angular/core/testing';

import { FoliofitMasterNutriChartService } from './foliofit-master-nutri-chart.service';

describe('FoliofitMasterNutriChartService', () => {
  let service: FoliofitMasterNutriChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FoliofitMasterNutriChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
