import { makeFailure, makeSuccess } from './types/Result.ts'
import type { ToResult } from './types/ToResult.ts'

export const tryPromise = async <R, E = unknown, TREAT extends boolean = true>(
    promise: Promise<R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): Promise<ToResult<R, E, TREAT>> => {
    try {
        const result = await promise
        if (treatReturnedErrorsAsThrown && result instanceof Error) {
            throw result
        }

        return makeSuccess(result) as ToResult<R, E, TREAT>
    } catch (error) {
        return makeFailure(error) as ToResult<R, E, TREAT>
    }
}
