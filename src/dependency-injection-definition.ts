import { InjectionToken } from "@angular/core";
import { DatabaseCreatorContract } from "./model/database-creator-contract";

export const IS_AVAILABLE_DATABASE = new InjectionToken<boolean>("is_available");
export const DATABASE_CREATOR = new InjectionToken<DatabaseCreatorContract>("database_creator");
