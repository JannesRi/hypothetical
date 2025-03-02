// https://stackoverflow.com/a/79299137/21143976
import type { Func } from './Func.ts'
import type { TryExpression } from './TryExpression.ts'

type ToObject<T extends object> = {
    [K in keyof T]: T[K]
}

// @ts-expect-error - This is a core type that unfortunately intrinsically has an error.
// The issue with a type like this is in theory they could overlap and the resulting type
// could become something like `never` or something ill-behaved.
// Fortunately this is used to add an overload which can never really conflict
// and so is pretty safe.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- needed for extending a function overlaod
export interface AddSignature<
    T extends object,
    Params extends unknown[],
    Return,
> extends T {
    (...args: Params): Return
}

export type SafeWrapFunctionOverloads<
    T extends Func,
    E = unknown,
    TREAT extends boolean = true,
    Shape extends object = ToObject<T>,
    ReturnShape extends object = ToObject<T>,
> =
    Shape extends T ? ReturnShape
    : T extends AddSignature<Shape, infer Params, infer Return> ?
        SafeWrapFunctionOverloads<
            T,
            E,
            TREAT,
            AddSignature<Shape, Params, Return>,
            AddSignature<
                ReturnShape,
                Params,
                TryExpression<Return, E, TREAT, Func<[], Return>>
            >
        >
    :   ReturnShape

export type SafeWrap<
    F extends Func,
    E = unknown,
    TREAT extends boolean = true,
> = SafeWrapFunctionOverloads<F, E, TREAT>
