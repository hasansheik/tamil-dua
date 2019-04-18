import { TestBed } from '@angular/core/testing';

import { DuaService } from './dua.service';

describe('DuaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DuaService = TestBed.get(DuaService);
    expect(service).toBeTruthy();
  });
});
