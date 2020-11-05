import { TestBed } from '@angular/core/testing';

import { TitleblinkerService } from './titleblinker.service';

describe('TitleblinkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TitleblinkerService = TestBed.get(TitleblinkerService);
    expect(service).toBeTruthy();
  });
});
