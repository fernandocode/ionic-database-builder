import { Injectable } from '@angular/core';
import { DatabaseCreatorContract, DatabaseConfig, DatabaseObject, DatabaseResult, DatabaseBaseTransaction } from 'database-builder';

@Injectable()
export class DatabaseMockService implements DatabaseCreatorContract {

  create(config: DatabaseConfig): Promise<DatabaseObject> {
    console.log('Database Fake! \\o/');
    return new Promise<DatabaseObject>((resolve, reject) => {
      resolve({
        executeSql: (statement: string, params: any): Promise<DatabaseResult> => {
          this.executeFake(statement, params);
          return new Promise<DatabaseResult>((executeSqlResolve, executeSqlReject) => {
            executeSqlResolve(this.resultFake());
          });
        },
        transaction: (fn: (transaction: DatabaseBaseTransaction) => void): Promise<any> => {
          return new Promise<any>((executeSqlResolve, executeSqlReject) => {
            fn({
              executeSql: (
                sql: string,
                values: any,
                success: (tx: DatabaseBaseTransaction, result: DatabaseResult) => void,
                error: (tx: DatabaseBaseTransaction, error: any) => void
              ): void => {
                this.executeFake(sql, values);
                success(void 0, this.resultFake());
              },
            } as DatabaseBaseTransaction);
            executeSqlResolve(void 0);
          });
        }
      } as DatabaseObject);
    });
  }

  private executeFake(sql: string, params: any) {
    console.log(`Fake - sql: ${sql}, params: ${JSON.stringify(params)}`);
  }

  private resultFake(): DatabaseResult {
    return {
      rows: {
        length: 20,
        item: (index: number) => {
          return {
            index
          };
        }
      }
    } as DatabaseResult;
  }

}
