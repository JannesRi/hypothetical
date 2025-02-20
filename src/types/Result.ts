export type Success<T> = [success: true, result: T, error: null]
export const makeSuccess = <T>(result: T): Success<T> => [true, result, null]

export type Failure<E = unknown> = [success: false, result: null, error: E]
export const makeFailure = <E>(error: E): Failure<E> => [false, null, error]

export type Result<T, E = unknown> = Success<T> | Failure<E>
