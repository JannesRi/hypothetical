import { sTry, type STry } from './sTry.ts'
import type { Func } from './types/Func.ts'

export type SWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
> = (...params: P) => STry<R, E, TREAT, Func<[], R>>

export function sWrap<TREAT extends boolean = true>(
    fn: never,
    treatReturnedErrorsAsThrown?: TREAT,
): never

export function sWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
>(fn: Func<P, R>, treatReturnedErrorsAsThrown?: TREAT): SWrap<P, R, E, TREAT>

export function sWrap<
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
>(
    fn: Func<P, R>,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): SWrap<P, R, E, TREAT> {
    return (...params: P) => {
        const result = () => fn(...params)

        return sTry<R, E, TREAT>(result, treatReturnedErrorsAsThrown)
    }
}
