import { describe, expect, expectTypeOf, it } from 'vitest'
import { sWrap } from './sWrap.ts'
import type { Failure, Result } from './types/Result.ts'

describe('sWrap', () => {
    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 1', () => {
        const fn = () => {
            throw new Error('error')

            return 'success'
        }

        expectTypeOf(sWrap<[], string, Error>(fn)).toEqualTypeOf<
            () => Result<string, Error>
        >()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 2', () => {
        const fn = () => {
            throw new Error('error')
        }

        expectTypeOf(sWrap<[], never, Error>(fn)).toEqualTypeOf<
            () => Failure<Error>
        >()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 3', () => {
        const fn = () => {
            return new Error('error')

            return 'success'
        }

        expectTypeOf(sWrap<[], Error | string, Error>(fn)).toEqualTypeOf<
            () => Result<string, Error>
        >()

        expectTypeOf(sWrap(fn, false)).toMatchTypeOf<
            () => Result<Error | string>
        >()
    })

    it('should wrap a sync function', () => {
        const add = (a: number, b: number) => a + b
        const wrappedAdd = sWrap(add)

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
        const wrappedDiv = sWrap(div)

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
        const wrappedDiv = sWrap(div)

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
        const wrappedDiv = sWrap(div, false)

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
        const wrappedAsyncAdd = sWrap(asyncAdd)

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
        const wrappedAsyncDiv = sWrap(asyncDiv)

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
        const wrappedAsyncDiv = sWrap(asyncDiv)

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
        const wrappedAsyncDiv = sWrap(asyncDiv, false)

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
