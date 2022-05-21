import { TestBed } from '@angular/core/testing';

import { MedArticleCategoryService } from './med-article-category.service';

describe('MedArticleCategoryService', () => {
  let service: MedArticleCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedArticleCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
