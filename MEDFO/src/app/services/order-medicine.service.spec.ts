import { TestBed } from '@angular/core/testing';

import { OrderMedicineService } from './order-medicine.service';

describe('OrderMedicineService', () => {
  let service: OrderMedicineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderMedicineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
