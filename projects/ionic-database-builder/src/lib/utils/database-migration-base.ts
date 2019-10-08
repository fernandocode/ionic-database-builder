
import * as momentNs from 'moment';
const moment = momentNs;
import { DatabaseObject } from 'database-builder';
import { Observable, Observer } from 'rxjs';

export abstract class DatabaseMigrationBase {

    public version(database: DatabaseObject, version: number): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            this.checkTableVersion(database)
                .subscribe(_ => {
                    this.checkVersion(database, version)
                        .subscribe((result: { oldVersion: number; newVersion: number; }) => {
                            this.migration(database, result)
                                .subscribe(r => {
                                    observer.next(r);
                                    observer.complete();
                                }, err => this.error(err, observer));
                        }, err => this.error(err, observer));
                }, err => this.error(err, observer));
        });
    }

    protected error(error: string, observer: Observer<any>) {
        // tslint:disable-next-line:no-console
        console.error(error);
        observer.error(error);
        observer.complete();
    }

    protected abstract migrationExecute(
        database: DatabaseObject, control: { oldVersion: number, newVersion: number }
    ): Observable<boolean>;

    private checkTableVersion(database: DatabaseObject): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            // return new Promise<any>((resolve, reject) => {
            const scriptTableVersion = `CREATE TABLE IF NOT EXISTS MigrationVersion(
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
                    , data INTEGER
                    , version TEXT
                    );`;
            database.executeSql(scriptTableVersion, {})
                .then(result => {
                    observer.next(result);
                    observer.complete();
                }, err => this.error(err, observer));
        });
    }

    private checkVersion(database: DatabaseObject, newVersion: number): Observable<{ oldVersion: number, newVersion: number }> {
        return Observable.create((observer: Observer<any>) => {
            this.getVersion(database).subscribe((oldVersion: number) => {
                if (oldVersion > 0) {
                    if (newVersion > oldVersion) {
                        // tslint:disable-next-line:no-console
                        console.info(`Version old: ${oldVersion}`);
                        database.executeSql(`UPDATE MigrationVersion
                                SET (data, version) = (?, ?);`,
                            [moment().unix(), newVersion])
                            .then()
                            .catch(err => this.error(err, observer));
                    }
                } else {
                    database.executeSql(`INSERT INTO MigrationVersion (data, version) VALUES (?, ?)`,
                        [moment().unix(), newVersion])
                        .then()
                        .catch(err => this.error(err, observer));
                }
                observer.next({
                    oldVersion,
                    newVersion
                });
                observer.complete();
            });
        });
    }

    private getVersion(database: DatabaseObject): Observable<number> {
        return Observable.create((observer: Observer<number>) => {
            database.executeSql(`SELECT * FROM MigrationVersion`, {})
                .then((result) => {
                    let version = 0;
                    if (result.rows.length > 0) {
                        version = Number.parseFloat(result.rows.item(0).version);
                    }
                    observer.next(version);
                    observer.complete();
                })
                .catch(err => this.error(err, observer));
        });
    }

    private migration(database: DatabaseObject, control: { oldVersion: number, newVersion: number }): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            this.migrationExecute(database, control)
                .subscribe(result => {
                    observer.next(result);
                    observer.complete();
                }, err => this.error(err, observer));
        });
    }
}
