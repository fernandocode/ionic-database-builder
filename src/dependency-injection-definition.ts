import { InjectionToken } from "@angular/core";
import { DatabaseCreatorContract } from "./model/database-creator-contract";

// export const VERSION = new InjectionToken<number>("version");
// export const DATABASE_NAME = new InjectionToken<string>("database_name");
export const IS_AVAILABLE_DATABASE = new InjectionToken<boolean>("is_available");
export const DATABASE_CREATOR = new InjectionToken<DatabaseCreatorContract>("database_creator");
