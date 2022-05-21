import { TestBed } from '@angular/core/testing';

import { MasterSettingsCategoryService } from './master-settings-category.service';

describe('MasterSettingsCategoryService', () => {
  let service: MasterSettingsCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterSettingsCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
