import { TestBed } from '@angular/core/testing';

import { AdsCartService } from './ads-cart.service';

describe('AdsCartService', () => {
  let service: AdsCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdsCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
