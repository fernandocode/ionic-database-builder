import { TableMapper } from './database/mapper/table-mapper';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DatabaseCreatorFake } from './database/factory/database-creator-fake';
import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { IonicDatabaseBuilderModule } from 'ionic-database-builder';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
