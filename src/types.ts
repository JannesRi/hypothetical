export type Success<T> = [success: true, result: T, error: null]

export type Failure<E extends Error = Error> = [
    success: false,
    result: null,
    error: E,
]

export type Result<T, E extends Error = Error> = Success<T> | Failure<E>
