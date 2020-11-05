import { TestBed } from '@angular/core/testing';

import { CurrentshiftService } from './currentshift.service';

describe('CurrentshiftService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentshiftService = TestBed.get(CurrentshiftService);
    expect(service).toBeTruthy();
  });
});
