import { TestBed } from '@angular/core/testing';

import { GeneratoreEsamiService } from './generatore-esami.service';

describe('GeneratoreEsamiService', () => {
  let service: GeneratoreEsamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneratoreEsamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
