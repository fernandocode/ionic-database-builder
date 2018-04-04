import { Observable } from "rxjs";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { DatabaseHelperService } from "./utils/database-helper-service";

@NgModule({
    declarations: [
        // declare all components that your module uses
        // MyComponent
    ],
    exports: [
        // export the component(s) that you want others to be able to use
        // MyComponent
    ]
})
export class DatabaseModule {
    // https://stackblitz.com/edit/ionic-j3f3ym
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: DatabaseModule,
            providers: [DatabaseHelperService]
        };
    }
}
