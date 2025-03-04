import type { Func } from './Func.ts'
import type { Failure } from './Result.ts'
import type { ToResult } from './ToResult.ts'

export type Tryable<R> = Promise<R> | Func<[], R>

export type TryExpression<
    R,
    E = unknown,
    TREAT extends boolean = true,
    Expression extends Tryable<R> = Tryable<R>,
> =
    Expression extends Promise<R> ? Promise<ToResult<R, E, TREAT>>
    : Expression extends Func<[], R> ?
        [R] extends [never] ? Failure<E>
        : R extends Promise<unknown> ? Promise<ToResult<Awaited<R>, E, TREAT>>
        : ToResult<R, E, TREAT>
    :   never
