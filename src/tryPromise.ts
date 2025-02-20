import { makeFailure, makeSuccess } from './types/Result.ts'
import type { Try } from './types/Try.ts'

export const tryPromise = async <R, E, TREAT extends boolean = true>(
    promise: Promise<R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): Promise<Try<R, E, TREAT>> => {
    try {
        const result = await promise
        if (treatReturnedErrorsAsThrown && result instanceof Error) {
            throw result
        }

        return makeSuccess(result) as Try<R, E, TREAT>
    } catch (error) {
        return makeFailure(error) as Try<R, E, TREAT>
    }
}
