import { TestBed } from '@angular/core/testing';

import { ExpertAdviceService } from './expert-advice.service';

describe('ExpertAdviceService', () => {
  let service: ExpertAdviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpertAdviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
