import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartSubscriptionComponent } from './cart-subscription.component';

describe('CartSubscriptionComponent', () => {
  let component: CartSubscriptionComponent;
  let fixture: ComponentFixture<CartSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
