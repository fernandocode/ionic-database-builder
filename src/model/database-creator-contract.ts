import { DatabaseObject } from "database-builder";
import { DatabaseConfig } from "./database-config";

export interface DatabaseCreatorContract {
    create(config: DatabaseConfig): Promise<DatabaseObject>;
}
