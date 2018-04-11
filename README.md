[![npm version](https://badge.fury.io/js/ionic-database-builder.svg/?a=1)](https://www.npmjs.com/package/ionic-database-builder)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/fernandocode/ionic-database-builder/issues)

# ionic-database-builder
Extended library from [database-builder](https://github.com/fernandocode/database-builder) to assist in creating and maintaining SQL commands with integrate execute commands in [SQLite ('@ionic-native/sqlite')](https://ionicframework.com/docs/native/sqlite/).

# Getting Started

### Step 1: Install npm module

```bash
ionic cordova plugin add cordova-sqlite-storage
npm install --save ionic-database-builder 
```
This will install the current stable version of `ionic-database-builder` in your `node_modules` directory and save the entry in `package.json`.

### Step 2: Add Module in App and Settings

#### Simple Setup

```ts
import { DatabaseModule, DatabaseSettingsFactoryDefault, MappersTableSimple } from 'ionic-database-builder';
import { DatabaseHelper } from 'database-builder';

@NgModule({
    ...
    imports: [
        DatabaseModule.forRootValue(
            // object to simple settings database
            new DatabaseSettingsFactoryDefault(
                1, // version database 
                "database1", // name database
                // mapper for database
                new MappersTableSimple(new DatabaseHelper(), {
                    references: false, // if "true" generate column for serialize object reference to JSON.
                        // Example in "TestClazz", create column "testClazzRef" to serialize "TestClazzRef" object
                    referencesId: true, // if "true" generate column for id reference.
                        // Example in "TestClazz", create column "testClazzRef_id" to save "TestClazzRef" property "id"
                    referencesIdRecursive: false, // if "true" generate column for id reference recursive for all references inner.
                    referencesIdColumn: "id" // name id column references
                })
                .mapper(
                    false, // readonly
                    void 0, // keyColumn: default "id"
                    void 0, // default settings constructor
                    // Type models for mapper
                    TestClazz,
                    TestClazzRef
                )),
            // implementation of "DatabaseMigrationContract" to estrategy migration upgrade versions database
            DatabaseMigrationService
            )
        ...
    ],
    ...
})
export class AppModule { }

```

**`DatabaseMigrationService`**

```ts
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { SQLiteTransaction } from '@ionic-native/sqlite';
import { Ddl } from 'database-builder';
import { DatabaseMigrationContract, Database, MappersTableBase } from 'ionic-database-builder';
import { Version } from 'ionic-database-builder/src/model/version-model';

@Injectable()
export class DatabaseMigrationService extends DatabaseMigrationContract {

    // implemented of "DatabaseMigrationContract"
    public to(version: Version, transation: SQLiteTransaction, mappers: MappersTableBase): Observable<any>[] {
        let observablesNested: Observable<any>[] = [];

        if (version.oldVersion < 2.0) {
            observablesNested.push(this.migration_v2_0(transation, version, mappers));
        }

        return observablesNested;
    }

    private migration_v2_0(transation: SQLiteTransaction, version: Version, mappers: MappersTableBase): Observable<any> {
        let observablesWait: Observable<any>[] = [];

        let ddl = new Ddl(transation, mappers, true);

        // drop tables deprecated
        observablesWait.push(Observable.fromPromise(ddl.drop(OldModel).execute()));
        
        // create new tables
        observablesWait.push(Observable.fromPromise(ddl.create(TestClazzRef).execute()));

        return Observable.forkJoin(observablesWait);
    }
}
```

#### Advanced Setup

```ts
import { DatabaseModule } from 'ionic-database-builder';

@NgModule({
    ...
    imports: [
        DatabaseModule.forRoot(
            DatabaseSettingsFactory,
            DatabaseMigration
        )
        ...
    ],
    ...
})
export class AppModule { }

```

**`DatabaseSettingsFactory`**

```ts
import { EnvironmentService } from './../providers/environment-service';
import { Injector } from '@angular/core';
import { DatabaseSettingsFactoryContract, MappersTableBase } from "ionic-database-builder";
import { MappersTable } from './mappers-table';

export class DatabaseSettingsFactory extends DatabaseSettingsFactoryContract {

    databaseName(injector: Injector): string {
        let environmentService: EnvironmentService = injector.get(EnvironmentService);
        return `database_${environmentService.isProdution ? 'prod' : 'test'}`;
    }

    version(injector: Injector): number {
        return 2.0;
    }

    mapper(injector: Injector): MappersTableBase {
        return injector.get(MappersTable);
    }

}
```

**`MappersTable`**

```ts
import { MappersTableSimple, DatabaseHelperService } from "ionic-database-builder";
import { Injectable } from "@angular/core";

@Injectable()
export class MappersTable extends MappersTableSimple {

    constructor(_databaseHelper: DatabaseHelperService) {
        super(
            _databaseHelper,
            {
                references: false,
                referencesId: true,
                referencesIdRecursive: false,
                referencesIdColumn: void 0
            }
        );

        this.mapper(false, void 0, this._defaultSettings,
            // Type models for mapper
            TestClazz,
            TestClazzRef
        );

        this.add(TestClazzAdvanced, false, void 0, {
            references: false,
            referencesId: false,
            referencesIdRecursive: false
        }, metadata => {
            metadata
                // add column reference1_id
                .mapper(x => x.reference1.id)
                // add column reference1_anything
                .mapper(x => x.reference1.anything);
        });
    }
}
```

### Step 3: Use `Database` in Components

`DatabaseModule` provides the injection of `Database` in its components and services, as can be seen in the following example:

**`MyApp`**

```ts
import { Database } from 'ionic-database-builder';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  constructor(
    // inject "Database"
    database: Database
  ) {
    database.query(TestClazz).then(query => {
      query
        .select(x => x.description)
        .where(where => where.equal(x => x.id, 1));
      console.log(query.compile());
      /**
       * {
       *  params: [1],
       *  query: "SELECT tes.description AS description FROM TestClazz AS tes WHERE tes.id > ?"
       * }
       */
      // to execute in database return promise with result
      query.toList();
    });
  }
}
```

[**More documentation on database-builder (Query, Crud, etc)**](https://github.com/fernandocode/database-builder).
