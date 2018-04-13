import { Injector } from "@angular/core";
import { MappersTableBase } from "..";

export abstract class DatabaseSettingsFactoryContract {

    public abstract databaseName(injector: Injector): string;
    public abstract version(injector: Injector): number;
    public abstract mapper(injector: Injector): MappersTableBase;

    // public factoryDatabase(injector: Injector): Promise<DatabaseObject> {
    //     return new Promise<DatabaseObject>((resolve, reject) => {
    //         const platform = injector.get(Platform);
    //         if (platform.is('cordova')) {
    //             const sqlite = injector.get(SQLite);
    //             const db = sqlite.create({
    //                 name: name,
    //                 location: 'default'
    //             });
    //             db.then((database: DatabaseObject) => {
    //                 this.migrationVersion(database, version)
    //                     .then(_ => resolve(db))
    //                     .catch(er => reject(er));
    //             }).catch(error => {
    //                 this.catchException(error);
    //                 reject(error);
    //             });
    //         } else {
    //             resolve(void 0);
    //         }
    //     });
    // }

}
