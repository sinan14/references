import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferalPromoDetailsComponent } from './referal-promo-details.component';

describe('ReferalPromoDetailsComponent', () => {
  let component: ReferalPromoDetailsComponent;
  let fixture: ComponentFixture<ReferalPromoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferalPromoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferalPromoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
