import type { Func } from './Func.ts'
import type { Failure } from './Result.ts'
import type { Try } from './Try.ts'

export type Tryable<R> = Promise<R> | Func<[], R>

export type TryExpression<
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
