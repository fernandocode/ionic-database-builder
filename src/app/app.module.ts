import { DatabaseMigrationService } from './database/provider/database-migration-service';
import { TableMapper } from './database/mapper/table-mapper';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DatabaseSettingsFactory } from './database/factory/database-settings-factory';
import { IonicDatabaseBuilderModule, WebSqlDatabaseService } from 'projects/ionic-database-builder/src/lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicDatabaseBuilderModule.forRoot(
      DatabaseSettingsFactory,
      WebSqlDatabaseService,
      DatabaseMigrationService
    )
  ],
  providers: [
    TableMapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
