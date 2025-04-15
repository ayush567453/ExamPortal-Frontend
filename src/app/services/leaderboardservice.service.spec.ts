import { TestBed } from '@angular/core/testing';

import { LeaderboardserviceService } from './leaderboardservice.service';

describe('LeaderboardserviceService', () => {
  let service: LeaderboardserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboardserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
