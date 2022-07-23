import { TestBed } from '@angular/core/testing';

import { ConnexionService } from './connexion.service';

describe('ConnexionServiceService', () => {
  let service: ConnexionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnexionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
