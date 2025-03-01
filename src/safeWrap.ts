import { safeTry } from './safeTry.ts'
import type { Func } from './types/Func.ts'
import type { TryExpression } from './types/TryExpression.ts'

export type SafeWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
> = (...params: P) => TryExpression<R, E, TREAT, Func<[], R>>

export function safeWrap<TREAT extends boolean = true>(
    fn: never,
    treatReturnedErrorsAsThrown?: TREAT,
): never

export function safeWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
>(fn: Func<P, R>, treatReturnedErrorsAsThrown?: TREAT): SafeWrap<P, R, E, TREAT>

export function safeWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
>(
    fn: Func<P, R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): SafeWrap<P, R, E, TREAT> {
    return (...params: P) => {
        const result = () => fn(...params)

        return safeTry<R, E, TREAT>(result, treatReturnedErrorsAsThrown)
    }
}
