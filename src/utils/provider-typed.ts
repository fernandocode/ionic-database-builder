import { InjectionToken, Type } from "@angular/core";

export declare type ProviderTyped<  T> =
    ValueProviderTyped<T> |
    ClassProviderTyped<T> |
    ExistingProviderTyped<T> |
    FactoryProviderTyped<T>;

export interface ValueProviderTyped<T> {
    /**
     * The value to inject.
     */
    useValue: T;
    /**
     * If true, then injector returns an array of instances. This is useful to allow multiple
     * providers spread across many files to provide configuration information to a common token.
     *
     * ### Example
     *
     * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
     */
    multi?: boolean;
}

export interface ClassProviderTyped<T> {
    /**
     * Class to instantiate for the `token`.
     */
    useClass: Type<T>;
    /**
     * If true, then injector returns an array of instances. This is useful to allow multiple
     * providers spread across many files to provide configuration information to a common token.
     *
     * ### Example
     *
     * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
     */
    multi?: boolean;
}

export interface ExistingProviderTyped<T> {
    /**
     * Existing `token` to return. (equivalent to `injector.get(useExisting)`)
     */
    useExisting: T;
    /**
     * If true, then injector returns an array of instances. This is useful to allow multiple
     * providers spread across many files to provide configuration information to a common token.
     *
     * ### Example
     *
     * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
     */
    multi?: boolean;
}

export interface FactoryProviderTyped<T> {
    /**
     * A function to invoke to create a value for this `token`. The function is invoked with
     * resolved values of `token`s in the `deps` field.
     */
    useFactory: (...args: any[]) => T;
    /**
     * A list of `token`s which need to be resolved by the injector. The list of values is then
     * used as arguments to the `useFactory` function.
     */
    deps?: any[];
    /**
     * If true, then injector returns an array of instances. This is useful to allow multiple
     * providers spread across many files to provide configuration information to a common token.
     *
     * ### Example
     *
     * {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
     */
    multi?: boolean;
}
