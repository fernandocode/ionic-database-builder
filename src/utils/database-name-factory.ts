
export interface DatabaseNameFactory {

    useFactory: (...args: any[]) => string;
    deps?: any[];

}
