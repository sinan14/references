import { TestBed } from '@angular/core/testing';

import { MasterSettingsBrandService } from './master-settings-brand.service';

describe('MasterSettingsBrandService', () => {
  let service: MasterSettingsBrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterSettingsBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
