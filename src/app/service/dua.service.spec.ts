import { TestBed } from '@angular/core/testing';

import { DuaService } from './dua.service';

describe('DuaService', () => {
  let service: DuaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
