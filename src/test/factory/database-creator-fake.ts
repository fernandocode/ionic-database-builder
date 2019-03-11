import { DatabaseBaseTransaction, DatabaseObject, DatabaseResult, DatabaseCreatorContract } from "database-builder";
import { DatabaseConfig } from "../../model/database-config";

export class DatabaseCreatorFake implements DatabaseCreatorContract {

    create(config: DatabaseConfig): Promise<DatabaseObject> {
        console.log("Database Fake! \\o/");
        return new Promise<DatabaseObject>((resolve, reject) => {
            resolve(<DatabaseObject>{
                executeSql: (statement: string, params: any): Promise<DatabaseResult> => {
                    this.executeFake(statement, params);
                    return new Promise<DatabaseResult>((resolve, reject) => {
                        resolve(this.resultFake());
                    });
                },
                transaction: (fn: (transaction: DatabaseBaseTransaction) => void): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        fn(<DatabaseBaseTransaction>{
                            executeSql: (
                                sql: string,
                                values: any,
                                success: (tx: DatabaseBaseTransaction, result: DatabaseResult) => void,
                                error: (tx: DatabaseBaseTransaction, error: any) => void
                            ): void => {
                                this.executeFake(sql, values);
                                success(void 0, this.resultFake());
                            },
                        })
                        resolve(void 0);
                    });
                }
            });
        });
    }

    private executeFake(sql: string, params: any) {
        console.log(`Fake - sql: ${sql}, params: ${JSON.stringify(params)}`);
    }

    private resultFake(): DatabaseResult {
        return <DatabaseResult>{
            rows: {
                length: 20,
                item: (index: number) => {
                    return {
                        index: index
                    }
                }
            }
        }
    }

}