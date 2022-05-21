import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPincodeComponent } from './main-pincode.component';

describe('MainPincodeComponent', () => {
  let component: MainPincodeComponent;
  let fixture: ComponentFixture<MainPincodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPincodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPincodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
