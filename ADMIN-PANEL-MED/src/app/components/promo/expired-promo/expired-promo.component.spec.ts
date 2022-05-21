import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPromoComponent } from './expired-promo.component';

describe('ExpiredPromoComponent', () => {
  let component: ExpiredPromoComponent;
  let fixture: ComponentFixture<ExpiredPromoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpiredPromoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
