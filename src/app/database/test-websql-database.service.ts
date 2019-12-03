// import { Injectable } from '@angular/core';
// import { WebSqlObjectInterface, DatabaseResult, WebSqlTransactionInterface } from 'database-builder';
// import { WebSqlDatabaseService } from 'ionic-database-builder';

// @Injectable()
// export class TestWebSqlDatabaseService extends WebSqlDatabaseService {

//     // protected convertToExecuteSql(
//     //     databaseNative: WebSqlObjectInterface
//     // ): (sql: string, values: any) => Promise<DatabaseResult> {
//     //     return (sql: string, values: any): Promise<DatabaseResult> => {
//     //         return new Promise<DatabaseResult>((executeSqlResolve, executeSqlReject) => {
//     //             if (
//     //                 sql.toUpperCase().indexOf('TRANSACTION') > -1
//     //                 ||
//     //                 sql.toUpperCase().indexOf('COMMIT') > -1
//     //                 ||
//     //                 sql.toUpperCase().indexOf('ROLLBACK') > -1
//     //             ) {
//     //                 this.ignoreExecuteSql(sql, values)
//     //                     .then(result => executeSqlResolve(result))
//     //                     .catch(err => executeSqlReject(err));
//     //             } else {
//     //                 databaseNative.transaction(transaction => {
//     //                     return this.executeSql(transaction, sql, values)
//     //                         .then(result => executeSqlResolve(result))
//     //                         .catch(err => executeSqlReject(err));
//     //                 });
//     //             }
//     //         });
//     //     };
//     // }

//     // protected convertToSqlBatch(
//     //     databaseNative: WebSqlObjectInterface
//     // ): (sqlStatements: Array<(string | string[] | any)>) => Promise<DatabaseResult[]> {
//     //     return (sqlStatements: any[]) => {
//     //         return (this as any).batch(databaseNative, sqlStatements, true);
//     //     };
//     // }

//     // protected batch(
//     //     database: WebSqlObjectInterface,
//     //     sqlStatements: Array<string | string[] | any>,
//     //     runInTransaction: boolean
//     // ): Promise<DatabaseResult[]> {
//     //     if (!sqlStatements || sqlStatements.constructor !== Array) {
//     //         throw Error('sqlBatch expects an array');
//     //     }
//     //     const batchList = [];
//     //     for (const st of sqlStatements) {
//     //         if (st.constructor === Array) {
//     //             if (st.length === 0) {
//     //                 throw Error('sqlBatch array element of zero (0) length');
//     //             }
//     //             batchList.push(
//     //                 {
//     //                     sql: st[0],
//     //                     params: st.length === 0 ? [] : st[1]
//     //                 }
//     //             );
//     //         } else {
//     //             batchList.push({
//     //                 sql: st,
//     //                 params: []
//     //             });
//     //         }
//     //     }
//     //     return this.executeBatchs(database, batchList, runInTransaction);
//     // }

//     protected transaction(databaseNative: WebSqlObjectInterface) {
//         return new Promise<WebSqlTransactionInterface>((resolve, reject) => {
//             try {
//                 databaseNative.transaction(async transaction => {
//                     resolve(transaction);
//                 });
//             } catch (error) {
//                 reject(error);
//             }
//         });
//     }

//     protected async executeBatchs(
//         databaseNative: WebSqlObjectInterface,
//         batchs: Array<{ sql: string, params: any[] }>,
//         runInTransaction: boolean
//     ): Promise<DatabaseResult[]> {
//         const result: DatabaseResult[] = [];
//         const transaction = await this.transaction(databaseNative);
//         for (const batch of batchs) {
//             result.push(await this.executeSql(transaction, batch.sql, batch.params));
//         }
//         return result;
//     }

//     // quando atualizar o database-builder pode remover isso
//     protected executeSql(transaction: WebSqlTransactionInterface, sql: string, values: any): Promise<DatabaseResult> {
//         return new Promise<DatabaseResult>((resolve, reject) => {
//             transaction.executeSql(
//                 sql,
//                 Array.isArray(values) ? values : [],
//                 (_t: WebSqlTransactionInterface, r: any) => resolve(r),
//                 (_t: WebSqlTransactionInterface, err: any) => {
//                     reject(err);
//                     // It is need to return truely to rollback in the transaction
//                     // https://stackoverflow.com/a/21993115/2290538
//                     return true;
//                 }
//             );
//         });
//     }

// }
