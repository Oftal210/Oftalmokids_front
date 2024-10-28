import { TestBed } from '@angular/core/testing';

import { PadreService } from './padre.service';

describe('PadreService', () => {
  let service: PadreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PadreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
