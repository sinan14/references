import { TestBed } from '@angular/core/testing';

import { MasterStoreCreationService } from './master-store-creation.service';

describe('MasterStoreCreationService', () => {
  let service: MasterStoreCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterStoreCreationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
