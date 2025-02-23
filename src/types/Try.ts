import type { Failure, Result } from './Result.ts'

export type Try<T, E, TREAT extends boolean = true> =
    [T] extends [never] ? Failure<E>
    : TREAT extends true ?
        T extends Error ?
            Failure<Error>
        :   Result<T, E>
    :   Result<T, E>
