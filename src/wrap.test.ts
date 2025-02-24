import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Failure, Result } from './types/Result.ts'
import { wrap } from './wrap.ts'

describe('wrap', () => {
    it('should wrap a sync function', () => {
        const add = (a: number, b: number) => a + b
        const wrappedAdd = wrap(add)

        expectTypeOf(wrappedAdd).toEqualTypeOf<
            (a: number, b: number) => Result<number>
        >()
        expect(wrappedAdd(1, 2)).not.toBeInstanceOf(Promise)

        const [success, result, error] = wrappedAdd(1, 2)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(3)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })

    it('should wrap a sync function throwing an error', () => {
        const div = (a: number, b: number) => {
            if (b === 0) throw new Error('Cannot divide by zero')

            return a / b
        }
        const wrappedDiv = wrap(div)

        expectTypeOf(wrappedDiv).toEqualTypeOf<
            (a: number, b: number) => Result<number>
        >()
        expect(wrappedDiv(1, 0)).not.toBeInstanceOf(Promise)
        expect(wrappedDiv(1, 2)).not.toBeInstanceOf(Promise)

        const [success, result, error] = wrappedDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })

    it('should wrap a sync function returning an error 1', () => {
        const div = (a: number, b: number) => {
            if (b === 0) return new Error('Cannot divide by zero')

            return a / b
        }
        const wrappedDiv = wrap(div)

        expectTypeOf(wrappedDiv).toMatchTypeOf<
            (a: number, b: number) => Result<number> | Failure<Error>
        >()
        expect(wrappedDiv(1, 0)).not.toBeInstanceOf(Promise)
        expect(wrappedDiv(1, 2)).not.toBeInstanceOf(Promise)

        const [success, result, error] = wrappedDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })

    it('should wrap a sync function returning an error 2', () => {
        const div = (a: number, b: number) => {
            if (b === 0) return new Error('Cannot divide by zero')

            return a / b
        }
        const wrappedDiv = wrap(div, false)

        expectTypeOf(wrappedDiv).toMatchTypeOf<
            (a: number, b: number) => Result<number | Error>
        >()
        expect(wrappedDiv(1, 0)).not.toBeInstanceOf(Promise)
        expect(wrappedDiv(1, 2)).not.toBeInstanceOf(Promise)

        const [success, result, error] = wrappedDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | Error | null>()
        expect(result).toBeInstanceOf(Error)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })

    it('should wrap an async function', async () => {
        const asyncAdd = async (a: number, b: number) => Promise.resolve(a + b)
        const wrappedAsyncAdd = wrap(asyncAdd)

        expectTypeOf(wrappedAsyncAdd).toEqualTypeOf<
            (a: number, b: number) => Promise<Result<number>>
        >()
        expect(wrappedAsyncAdd(1, 2)).toBeInstanceOf(Promise)

        const [success, result, error] = await wrappedAsyncAdd(1, 2)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(3)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })

    it('should wrap an async function throwing an error', async () => {
        const asyncDiv = async (a: number, b: number) => {
            return new Promise<number>((resolve, reject) => {
                if (b === 0) reject(new Error('Cannot divide by zero'))

                resolve(a / b)
            })
        }
        const wrappedAsyncDiv = wrap(asyncDiv)

        expectTypeOf(wrappedAsyncDiv).toEqualTypeOf<
            (a: number, b: number) => Promise<Result<number>>
        >()
        expect(wrappedAsyncDiv(1, 0)).toBeInstanceOf(Promise)
        expect(wrappedAsyncDiv(1, 2)).toBeInstanceOf(Promise)

        const [success, result, error] = await wrappedAsyncDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })

    it('should wrap an async function returning an error 1', async () => {
        const asyncDiv = async (a: number, b: number) => {
            return new Promise<number | Error>((resolve) => {
                if (b === 0) resolve(new Error('Cannot divide by zero'))

                resolve(a / b)
            })
        }
        const wrappedAsyncDiv = wrap(asyncDiv)

        expectTypeOf(wrappedAsyncDiv).toEqualTypeOf<
            (a: number, b: number) => Promise<Result<number> | Failure<Error>>
        >()
        expect(wrappedAsyncDiv(1, 0)).toBeInstanceOf(Promise)
        expect(wrappedAsyncDiv(1, 2)).toBeInstanceOf(Promise)

        const [success, result, error] = await wrappedAsyncDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<number | null>()
        expect(result).toBe(null)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
    })

    it('should wrap an async function returning an error 2', async () => {
        const asyncDiv = async (a: number, b: number) => {
            return new Promise<number | Error>((resolve) => {
                if (b === 0) resolve(new Error('Cannot divide by zero'))

                resolve(a / b)
            })
        }
        const wrappedAsyncDiv = wrap(asyncDiv, false)

        expectTypeOf(wrappedAsyncDiv).toMatchTypeOf<
            (a: number, b: number) => Promise<Result<number | Error>>
        >()
        expect(wrappedAsyncDiv(1, 0)).toBeInstanceOf(Promise)
        expect(wrappedAsyncDiv(1, 2)).toBeInstanceOf(Promise)

        const [success, result, error] = await wrappedAsyncDiv(1, 0)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<number | Error | null>()
        expect(result).toBeInstanceOf(Error)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(null)
    })
})
