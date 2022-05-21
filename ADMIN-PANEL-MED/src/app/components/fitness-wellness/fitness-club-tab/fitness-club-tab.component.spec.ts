import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FitnessClubTabComponent } from './fitness-club-tab.component';

describe('FitnessClubTabComponent', () => {
  let component: FitnessClubTabComponent;
  let fixture: ComponentFixture<FitnessClubTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FitnessClubTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FitnessClubTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
