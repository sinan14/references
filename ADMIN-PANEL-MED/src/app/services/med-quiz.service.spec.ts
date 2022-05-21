import { TestBed } from '@angular/core/testing';

import { MedQuizService } from './med-quiz.service';

describe('MedQuizService', () => {
  let service: MedQuizService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedQuizService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
