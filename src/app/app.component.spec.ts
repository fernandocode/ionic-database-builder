import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { IonicDatabaseBuilderModule } from 'projects/ionic-database-builder/src/public_api';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { DatabaseCreatorFake } from './database/factory/database-creator-fake';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { TableMapper } from './database/mapper/table-mapper';
import { Database } from 'ionic-database-builder';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        IonicDatabaseBuilderModule.forRoot(
          DatabaseSettingsFactory,
          true,
          DatabaseCreatorFake,
          false,
          DatabaseMigrationService
        )
      ],
      providers: [
        TableMapper
      ],
    });
  }));

  it('should create the app', () => {
    console.log("test");
    let database = TestBed.get(Database);
    console.log(database);
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ionic-database-builder-library'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ionic-database-builder-library');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ionic-database-builder-library!');
  });
});
