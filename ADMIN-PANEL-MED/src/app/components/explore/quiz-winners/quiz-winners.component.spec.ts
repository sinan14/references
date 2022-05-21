import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizWinnersComponent } from './quiz-winners.component';

describe('QuizWinnersComponent', () => {
  let component: QuizWinnersComponent;
  let fixture: ComponentFixture<QuizWinnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizWinnersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
