import { TestBed } from '@angular/core/testing';

import { QuizresultService } from './quizresult.service';

describe('QuizresultService', () => {
  let service: QuizresultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizresultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
