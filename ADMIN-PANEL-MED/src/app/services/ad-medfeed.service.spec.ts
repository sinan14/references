import { TestBed } from '@angular/core/testing';

import { AdMedfeedService } from './ad-medfeed.service';

describe('AdMedfeedService', () => {
  let service: AdMedfeedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdMedfeedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
