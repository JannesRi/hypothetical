import { sTry } from './sTry.ts'
import type { Func } from './types/Func.ts'

export const wrap = <P extends unknown[], R>(fn: Func<P, R>) => {
    return (...params: P) => {
        const result = () => fn(...params)

        return sTry(result)
    }
}
