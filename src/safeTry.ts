import { tryPromise } from './tryPromise.ts'
import type { Func } from './types/Func.ts'
import { makeFailure, makeSuccess } from './types/Result.ts'
import type { Tryable, TryExpression } from './types/TryExpression.ts'

export function safeTry<TREAT extends boolean = true>(
    expression: never,
    treatReturnedErrorsAsThrown?: TREAT,
): never

export function safeTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Promise<R>,
    treatReturnedErrorsAsThrown?: TREAT,
): TryExpression<R, E, TREAT, Promise<R>>

export function safeTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Func<[], R>,
    treatReturnedErrorsAsThrown?: TREAT,
): TryExpression<R, E, TREAT, Func<[], R>>

export function safeTry<R, E = unknown, TREAT extends boolean = true>(
    expression: Tryable<R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): TryExpression<R, E, TREAT> {
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

            return makeSuccess(result) as TryExpression<R, E, TREAT>
        }

        return tryPromise<R, E, TREAT>(expression, treatReturnedErrorsAsThrown)
    } catch (error) {
        return makeFailure(error) as TryExpression<R, E, TREAT>
    }
}
