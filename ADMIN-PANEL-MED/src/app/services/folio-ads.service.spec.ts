import { TestBed } from '@angular/core/testing';

import { FolioAdsService } from './folio-ads.service';

describe('FolioAdsService', () => {
  let service: FolioAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FolioAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
