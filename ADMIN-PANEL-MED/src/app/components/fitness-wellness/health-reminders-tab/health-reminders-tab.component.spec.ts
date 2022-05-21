import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthRemindersTabComponent } from './health-reminders-tab.component';

describe('HealthRemindersTabComponent', () => {
  let component: HealthRemindersTabComponent;
  let fixture: ComponentFixture<HealthRemindersTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthRemindersTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthRemindersTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
