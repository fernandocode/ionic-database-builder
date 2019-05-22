import { Injectable } from '@angular/core';
import { WebSqlDatabaseAdapter } from 'database-builder';

// /**
//  * @deprecated use WebSqlDatabaseService
//  */
// @Injectable()
// export class DatabaseBrowserService extends WebSqlDatabaseAdapter {
//     constructor() {
//         super((window as any));
//     }
// }

@Injectable()
export class WebSqlDatabaseService extends WebSqlDatabaseAdapter {
    constructor() {
        super((window as any));
    }
}

// export class DatabaseBrowserService implements DatabaseCreatorContract {

//   create(config: DatabaseConfig): Promise<DatabaseObject> {
//     console.warn("Use WebSQL only for testing, some browsers no longer support WebSQL! \\o/");
//     return new Promise<DatabaseObject>((resolve, reject) => {
//       // o método OpenDatabase precisa de 4 parametros; o nome do banco de dados, a versão, a descrição e o tamanho estimado (em bytes)
//       const db = (window as any).openDatabase(config.name, "1.0", config.name, 200000);

//       // de qualquer forma, sempre teste que o objeto foi instanciado direito antes de usá-lo
//       if (!db) {
//         reject("Não foi possivel iniciar o banco de dados no Browser!");
//       }
//       resolve(<DatabaseObject>{
//         executeSql: (statement: string, params: any): Promise<DatabaseResult> => {
//           return new Promise<DatabaseResult>((resolve, reject) => {
//             if (
//               statement.toUpperCase().indexOf("TRANSACTION") > -1
//               ||
//               statement.toUpperCase().indexOf("COMMIT") > -1
//             ) {
//               console.warn(`command sql ignored: '${statement}'`);
//               resolve({} as DatabaseResult);
//               return;
//             }
//             db.transaction((transaction: any) => {
//               transaction.executeSql(statement, Array.isArray(params) ? params : [],
//                 (s: any, r: any) => resolve(r),
//                 (e: any, err: any) => {
//                   reject(err)
//                 });
//             });
//           });
//         },
//         transaction:
//           (fn: (transaction: DatabaseBaseTransaction) => void): Promise<any> => {
//             return db.transaction((transiction: any) => {
//               fn({
//                 executeSql: (sql: string, values: any): Promise<DatabaseResult> => {
//                   return new Promise<DatabaseResult>((resolve, reject) => {
//                     transiction.executeSql(sql, Array.isArray(values) ? values : [],
//                       (s: any, r: any) => {
//                         resolve(r)
//                       },
//                       (e: any, err: any) => {
//                         reject(err)
//                       });
//                   });
//                 }
//               });
//             });
//           }
//       });
//     });
//   }
// }
