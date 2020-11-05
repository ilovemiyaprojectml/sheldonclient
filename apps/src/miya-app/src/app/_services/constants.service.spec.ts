import { TestBed } from '@angular/core/testing';

import { CurrentshiftService } from './currentshift.service';

describe('ConstantsService', () => {  
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstantsService = TestBed.get(ConstantsService);
    expect(service).toBeTruthy();
  });
});
