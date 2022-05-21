import { TestBed } from '@angular/core/testing';

import { AdsWebServiceService } from './ads-web-service.service';

describe('AdsWebServiceService', () => {
  let service: AdsWebServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsWebServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
