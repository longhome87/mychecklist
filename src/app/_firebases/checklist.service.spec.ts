/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CheckListDataService } from './checklist.service';

describe('Service: Checklist', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckListDataService]
    });
  });

  it('should ...', inject([CheckListDataService], (service: CheckListDataService) => {
    expect(service).toBeTruthy();
  }));
});
