import { TestBed } from '@angular/core/testing';

import { MostSearchedService } from './most-searched.service';

describe('MostSearchedService', () => {
  let service: MostSearchedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MostSearchedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
