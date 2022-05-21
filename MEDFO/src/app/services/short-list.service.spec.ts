import { TestBed } from '@angular/core/testing';

import { ShortListService } from './short-list.service';

describe('ShortListService', () => {
  let service: ShortListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShortListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
