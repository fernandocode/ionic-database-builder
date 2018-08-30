import { Observer } from "rxjs/Observer";
import { Observable } from "rxjs/Observable";
import * as momentNs from "moment";
const moment = momentNs;
import { DatabaseObject, DatabaseTransaction } from "database-builder";

export abstract class DatabaseMigrationBase {

    public version(database: DatabaseObject, version: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.checkTableVersion(database).then(_ => {
                this.checkVersion(database, version)
                    .subscribe(result => {
                        this.migration(database, result)
                            .then(r => resolve(r))
                            .catch(er => reject(er));
                    }, er => reject(er));
            })
                .catch(er => reject(er));
        });
    }

    protected error(error: string, observer: Observer<any>) {
        // tslint:disable-next-line:no-console
        console.error(error);
        observer.error(error);
        observer.complete();
    }

    protected abstract migrationExecute(
        transation: DatabaseTransaction, control: { oldVersion: number, newVersion: number }): Promise<boolean>;

    private checkTableVersion(database: DatabaseObject): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            const scriptTableVersion = `CREATE TABLE IF NOT EXISTS MigrationVersion(
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
                    , data INTEGER
                    , version TEXT
                    );`;
            database.executeSql(scriptTableVersion, {})
                .then(resolve)
                .catch(reject);
        });
    }

    private checkVersion(database: DatabaseObject, newVersion: number): Observable<{ oldVersion: number, newVersion: number }> {
        return Observable.create((observer: Observer<any>) => {
            this.getVersion(database).subscribe(oldVersion => {
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
                    oldVersion: oldVersion,
                    newVersion: newVersion
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

    private migration(database: DatabaseObject, control: { oldVersion: number, newVersion: number }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            database.transaction((transation: DatabaseTransaction) => {
                this.migrationExecute(transation, control)
                    .then(r => resolve(r))
                    .catch(er => reject(er));
            });
        });
    }
}
