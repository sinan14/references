import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveraddressCnfirmComponent } from './driveraddress-cnfirm.component';

describe('DriveraddressCnfirmComponent', () => {
  let component: DriveraddressCnfirmComponent;
  let fixture: ComponentFixture<DriveraddressCnfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriveraddressCnfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveraddressCnfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
