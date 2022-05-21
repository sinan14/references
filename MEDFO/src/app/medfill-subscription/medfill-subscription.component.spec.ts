import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedfillSubscriptionComponent } from './medfill-subscription.component';

describe('MedfillSubscriptionComponent', () => {
  let component: MedfillSubscriptionComponent;
  let fixture: ComponentFixture<MedfillSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedfillSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedfillSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
