import { TestBed } from '@angular/core/testing';

import { InventoryListingService } from './inventory-listing.service';

describe('InventoryListingService', () => {
  let service: InventoryListingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryListingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
