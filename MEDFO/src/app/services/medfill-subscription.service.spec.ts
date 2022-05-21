import { TestBed } from '@angular/core/testing';

import { MedfillSubscriptionService } from './medfill-subscription.service';

describe('MedfillSubscriptionService', () => {
  let service: MedfillSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedfillSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
