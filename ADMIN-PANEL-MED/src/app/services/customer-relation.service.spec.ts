import { TestBed } from '@angular/core/testing';

import { CustomerRelationService } from './customer-relation.service';

describe('CustomerRelationService', () => {
  let service: CustomerRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerRelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
