import { TestBed } from '@angular/core/testing';

import { MainPincodeSService } from './main-pincode-s.service';

describe('MainPincodeSService', () => {
  let service: MainPincodeSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainPincodeSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
