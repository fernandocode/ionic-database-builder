import { TestBed } from '@angular/core/testing';

import { IonicDatabaseBuilderService } from './ionic-database-builder.service';

describe('IonicDatabaseBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicDatabaseBuilderService = TestBed.get(IonicDatabaseBuilderService);
    expect(service).toBeTruthy();
  });
});
