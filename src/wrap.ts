import { sTry } from './sTry.ts'

export const wrap = <
    P extends unknown[],
    R,
    E = unknown,
    TREAT extends boolean = true,
>(
    fn: (...args: [...P]) => R,
    treatReturnedErrorsAsThrown: TREAT = true as TREAT,
) => {
    return (...params: P) => {
        const result = () => fn(...params)

        return sTry<R, E, TREAT>(result, treatReturnedErrorsAsThrown)
    }
}
