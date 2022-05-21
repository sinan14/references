import { TestBed } from '@angular/core/testing';

import { PaymentMessageService } from './payment-message.service';

describe('PaymentMessageService', () => {
  let service: PaymentMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
