import { TestBed } from '@angular/core/testing';

import { YogaPageTabService } from './yoga-page-tab.service';

describe('YogaPageTabService', () => {
  let service: YogaPageTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YogaPageTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
