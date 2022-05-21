import { TestBed } from '@angular/core/testing';

import { MedArticleService } from './med-article.service';

describe('MedArticleService', () => {
  let service: MedArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
