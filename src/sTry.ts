import { tryPromise } from './tryPromise.ts'
import type { Func } from './types/Func.ts'
import { makeFailure, makeSuccess } from './types/Result.ts'
import type { Try } from './types/Try.ts'

type Tryable<R> = Promise<R> | Func<[], R>

type STry<R, E, Expression extends Tryable<R>, TREAT extends boolean = true> =
    Expression extends Promise<unknown> ? Promise<Try<R, E, TREAT>>
    : R extends Promise<unknown> ? Promise<Try<R, E, TREAT>>
    : Try<R, E, TREAT>

export const sTry = <
    R,
    E,
    Expression extends Tryable<R>,
    TREAT extends boolean = true,
>(
    expression: Expression,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): STry<R, E, Expression, TREAT> => {
    try {
        if (typeof expression === 'function') {
            const result = expression()
            if (result instanceof Promise) {
                return tryPromise<R, E, TREAT>(
                    result,
                    treatReturnedErrorsAsThrown,
                ) as STry<R, E, Expression, TREAT>
            }

            if (treatReturnedErrorsAsThrown && result instanceof Error) {
                throw result
            }

            return makeSuccess(result) as STry<R, E, Expression, TREAT>
        }

        return tryPromise<R, E, TREAT>(
            expression,
            treatReturnedErrorsAsThrown,
        ) as STry<R, E, Expression, TREAT>
    } catch (error) {
        return makeFailure(error) as STry<R, E, Expression, TREAT>
    }
}
