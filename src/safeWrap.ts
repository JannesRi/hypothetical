import { safeTry } from './safeTry.ts'
import type { Func } from './types/Func.ts'
import type { SafeWrap } from './types/SafeWrap.ts'

export function safeWrap<TREAT extends boolean = true>(
    fn: never,
    treatReturnedErrorsAsThrown?: TREAT,
): never

export function safeWrap<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- better type inference than `unknown`
    F extends Func<any[], any>,
    E = unknown,
    TREAT extends boolean = true,
>(fn: F, treatReturnedErrorsAsThrown?: TREAT): SafeWrap<F, E, TREAT>

export function safeWrap<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- better type inference than `unknown`
    F extends Func<any[], any>,
    E = unknown,
    TREAT extends boolean = true,
>(
    fn: F,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
): SafeWrap<F, E, TREAT> {
    const wrapped = (...params: unknown[]) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- calling it with the same parameters as the function signature
        const result = () => fn(...params)

        return safeTry(result, treatReturnedErrorsAsThrown)
    }

    return wrapped as SafeWrap<F, E, TREAT>
}
