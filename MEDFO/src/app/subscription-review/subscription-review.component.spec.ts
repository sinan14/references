import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionReviewComponent } from './subscription-review.component';

describe('SubscriptionReviewComponent', () => {
  let component: SubscriptionReviewComponent;
  let fixture: ComponentFixture<SubscriptionReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
