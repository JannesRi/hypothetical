import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Result } from './types/Result.ts'
import { wrap } from './wrap.ts'

describe('wrap', () => {
    const add = (a: number, b: number) => a + b
    const wrappedAdd = wrap(add)
    expectTypeOf(wrappedAdd).toEqualTypeOf<
        (a: number, b: number) => Result<number>
    >()

    const asyncAdd = async (a: number, b: number) => Promise.resolve(a + b)
    const wrappedAsyncAdd = wrap(asyncAdd)
    expectTypeOf(wrappedAsyncAdd).toEqualTypeOf<
        (a: number, b: number) => Promise<Result<number>>
    >()

    const div = (a: number, b: number) => {
        if (b === 0) throw new Error('Cannot divide by zero')

        return a / b
    }
    const wrappedDiv = wrap(div)
    expectTypeOf(wrappedDiv).toEqualTypeOf<
        (a: number, b: number) => Result<number>
    >()

    const asyncDiv = async (a: number, b: number) => {
        if (b === 0) throw new Error('Cannot divide by zero')

        return Promise.resolve(a / b)
    }
    const wrappedAsyncDiv = wrap(asyncDiv)
    expectTypeOf(wrappedAsyncDiv).toEqualTypeOf<
        (a: number, b: number) => Promise<Result<number>>
    >()

    // test this
    const a = wrap(() => {
        throw new Error('This is an error')

        return "This won't be returned"
    })()

    it('should wrap a function', () => {
        const [success, result, error] = wrappedAdd(1, 2)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(3)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })

    it('should handle async functions', async () => {
        const [success, result, error] = await wrappedAsyncAdd(1, 2)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(3)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })

    it('should handle errors', () => {
        const [success, result, error] = wrappedDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })

    it('should handle errors in async functions', async () => {
        const [success, result, error] = await wrappedAsyncDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })
})
