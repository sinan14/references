import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewSubscriptionComponent } from './review-subscription.component';

describe('ReviewSubscriptionComponent', () => {
  let component: ReviewSubscriptionComponent;
  let fixture: ComponentFixture<ReviewSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
