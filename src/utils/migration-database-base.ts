import { Observer } from "rxjs/Observer";
import { Alert, App, Config } from "ionic-angular";
import { SQLiteObject, SQLiteTransaction } from "@ionic-native/sqlite";
import { Observable } from "rxjs/Observable";
import * as moment from "moment";

export abstract class MigrationDatabaseBase {

    constructor(
        protected _app: App, protected _config: Config
    ) {

    }

    public version(database: SQLiteObject, version: number): Promise<boolean> {
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

    protected errorAlert(error: string) {
        // tslint:disable-next-line:no-console
        console.error(error);
        const alert = new Alert(this._app, {
            title: "Erro ao salvar dados off-line!",
            message: error,
            buttons: ["OK"]
        }, this._config);
        alert.present();
    }

    protected abstract migrationExecute(transation: SQLiteTransaction, control: { oldVersion: number, newVersion: number }): Promise<boolean>;

    private checkTableVersion(database: SQLiteObject): Promise<any> {
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

    private checkVersion(database: SQLiteObject, newVersion: number): Observable<{ oldVersion: number, newVersion: number }> {
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
                            .catch(this.errorAlert);
                    }
                } else {
                    database.executeSql(`INSERT INTO MigrationVersion (data, version) VALUES (?, ?)`,
                        [moment().unix(), newVersion])
                        .then()
                        .catch(this.errorAlert);
                }
                observer.next({
                    oldVersion: oldVersion,
                    newVersion: newVersion
                });
                observer.complete();
            });
        });
    }

    private getVersion(database: SQLiteObject): Observable<number> {
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
                .catch(this.errorAlert);
        });
    }

    private migration(database: SQLiteObject, control: { oldVersion: number, newVersion: number }): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            database.transaction((transation: SQLiteTransaction) => {
                this.migrationExecute(transation, control)
                    .then(r => resolve(r))
                    .catch(er => reject(er));
            });
        });
    }
}
