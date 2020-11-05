import { TestBed } from '@angular/core/testing';

import { ShiftnotifService } from './shiftnotif.service';

describe('ShiftnotifService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShiftnotifService = TestBed.get(ShiftnotifService);
    expect(service).toBeTruthy();
  });
});
