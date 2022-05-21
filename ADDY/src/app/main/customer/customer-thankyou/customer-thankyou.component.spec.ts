import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerThankyouComponent } from './customer-thankyou.component';

describe('CustomerThankyouComponent', () => {
  let component: CustomerThankyouComponent;
  let fixture: ComponentFixture<CustomerThankyouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerThankyouComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerThankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
