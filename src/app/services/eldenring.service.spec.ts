import { TestBed } from '@angular/core/testing';

import { EldenringService } from './eldenring.service';

describe('EldenringService', () => {
  let service: EldenringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EldenringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
