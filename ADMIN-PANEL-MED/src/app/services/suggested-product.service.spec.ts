import { TestBed } from '@angular/core/testing';

import { SuggestedProductService } from './suggested-product.service';

describe('SuggestedProductService', () => {
  let service: SuggestedProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
