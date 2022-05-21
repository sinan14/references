import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YogaPageTabComponent } from './yoga-page-tab.component';

describe('YogaPageTabComponent', () => {
  let component: YogaPageTabComponent;
  let fixture: ComponentFixture<YogaPageTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YogaPageTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YogaPageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
