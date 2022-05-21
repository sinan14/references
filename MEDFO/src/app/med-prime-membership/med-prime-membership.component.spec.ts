import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedPrimeMembershipComponent } from './med-prime-membership.component';

describe('MedPrimeMembershipComponent', () => {
  let component: MedPrimeMembershipComponent;
  let fixture: ComponentFixture<MedPrimeMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedPrimeMembershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedPrimeMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
