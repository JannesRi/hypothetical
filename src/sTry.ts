import { tryPromise } from './tryPromise.ts'
import type { Func } from './types/Func.ts'
import { makeFailure, makeSuccess, type Failure } from './types/Result.ts'
import type { Try } from './types/Try.ts'

export type Tryable<R> = Promise<R> | Func<[], R>

export type STry<
    R,
    E = unknown,
    TREAT extends boolean = true,
    Expression extends Tryable<R> = Tryable<R>,
> =
    Expression extends Promise<R> ? Promise<Try<R, E, TREAT>>
    : Expression extends Func<[], R> ?
        [R] extends [never] ? Failure<E>
        : R extends Promise<unknown> ? Promise<Try<Awaited<R>, E, TREAT>>
        : Try<R, E, TREAT>
    :   never

export function sTry<TREAT extends boolean = true>(
    expression: never,
    treatReturnedErrorsAsThrown?: TREAT,
): never

export function sTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Promise<R>,
    treatReturnedErrorsAsThrown?: TREAT,
): STry<R, E, TREAT, Promise<R>>

export function sTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Func<[], R>,
    treatReturnedErrorsAsThrown?: TREAT,
): STry<R, E, TREAT, Func<[], R>>

export function sTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Tryable<R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): STry<R, E, TREAT> {
    try {
        if (typeof expression === 'function') {
            const result = expression()
            if (result instanceof Promise) {
                return tryPromise<R, E, TREAT>(
                    result,
                    treatReturnedErrorsAsThrown,
                )
            }

            if (treatReturnedErrorsAsThrown && result instanceof Error) {
                throw result
            }

            return makeSuccess(result) as STry<R, E, TREAT>
        }

        return tryPromise<R, E, TREAT>(expression, treatReturnedErrorsAsThrown)
    } catch (error) {
        return makeFailure(error) as STry<R, E, TREAT>
    }
}
