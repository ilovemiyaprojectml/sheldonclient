import { TestBed } from '@angular/core/testing';

import { UserpreferencesService } from './userpreferences.service';

describe('UserpreferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserpreferencesService = TestBed.get(UserpreferencesService);
    expect(service).toBeTruthy();
  });
});
