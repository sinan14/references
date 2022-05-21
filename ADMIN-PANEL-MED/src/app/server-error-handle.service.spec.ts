import { TestBed } from '@angular/core/testing';

import { ServerErrorHandleService } from './server-error-handle.service';

describe('ServerErrorHandleService', () => {
  let service: ServerErrorHandleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServerErrorHandleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
