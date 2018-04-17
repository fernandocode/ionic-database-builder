import { DatabaseCreatorContract } from "../../model/database-creator-contract";
import { DatabaseObject, DatabaseResult, DatabaseTransaction } from "database-builder";
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
                transaction: (fn: (transaction: DatabaseTransaction) => void): Promise<any> => {
                    return new Promise<any>((resolve, reject) => {
                        fn(<DatabaseTransaction>{
                            executeSql: (
                                sql: string,
                                values: any,
                                success: (tx: DatabaseTransaction, result: DatabaseResult) => void,
                                error: (tx: DatabaseTransaction, error: any) => void
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
        console.log(`sql: ${sql}, params: ${JSON.stringify(params)}`);
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