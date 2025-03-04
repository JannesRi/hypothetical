import { describe, expect, expectTypeOf, it } from 'vitest'
import { safeWrap } from './safeWrap.ts'
import type { Func } from './types/Func.ts'
import type { Failure, Result } from './types/Result.ts'

describe('safeWrap', () => {
    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should not accept other values 1', () => {
        type Input<T, P extends unknown[] = unknown[], R = unknown> =
            T extends Func<P, R> ? true : false

        expectTypeOf<Input<() => unknown>>().toEqualTypeOf<true>()
        expectTypeOf<
            Input<(a: string) => unknown, [string]>
        >().toEqualTypeOf<true>()

        expectTypeOf<Input<string>>().toEqualTypeOf<false>()
        expectTypeOf<Input<number>>().toEqualTypeOf<false>()
        expectTypeOf<Input<boolean>>().toEqualTypeOf<false>()
        expectTypeOf<Input<null>>().toEqualTypeOf<false>()
        expectTypeOf<Input<undefined>>().toEqualTypeOf<false>()
        expectTypeOf<Input<unknown>>().toEqualTypeOf<false>()
        expectTypeOf<Input<unknown[]>>().toEqualTypeOf<false>()
        expectTypeOf<Input<object>>().toEqualTypeOf<false>()
        expectTypeOf<Input<symbol>>().toEqualTypeOf<false>()
        expectTypeOf<Input<Promise<unknown>>>().toEqualTypeOf<false>()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it.fails('should not accept other values 2', () => {
        const throwing = () => {
            throw new Error('error')
        }

        expectTypeOf(safeWrap(throwing())).toEqualTypeOf<never>()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 1', () => {
        const fn = () => {
            throw new Error('error')

            return 'success'
        }

        expectTypeOf(safeWrap<() => string, Error>(fn)).toEqualTypeOf<
            () => Result<string, Error>
        >()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 2', () => {
        const fn = () => {
            throw new Error('error')
        }

        expectTypeOf(safeWrap<() => never, Error>(fn)).toEqualTypeOf<
            () => Failure<Error>
        >()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 3', () => {
        const fn = () => {
            return new Error('error')

            return 'success'
        }

        expectTypeOf(safeWrap<() => Error | string, Error>(fn)).toEqualTypeOf<
            () => Result<string, Error>
        >()

        expectTypeOf(safeWrap(fn, false)).toMatchTypeOf<
            () => Result<Error | string>
        >()
    })

    it('should wrap a sync function', () => {
        const add = (a: number, b: number) => a + b
        const wrappedAdd = safeWrap(add)

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
        const wrappedDiv = safeWrap(div)

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
        const wrappedDiv = safeWrap(div)

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
        const wrappedDiv = safeWrap(div, false)

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
        const wrappedAsyncAdd = safeWrap(asyncAdd)

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
        const wrappedAsyncDiv = safeWrap(asyncDiv)

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
        const wrappedAsyncDiv = safeWrap(asyncDiv)

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
        const wrappedAsyncDiv = safeWrap(asyncDiv, false)

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

    it('should wrap an overloaded function', async () => {
        const thrownError = new Error('Invalid arguments')

        function add(a: number, b: number): number
        function add(a: boolean, b: boolean): never
        async function add(a: string, b: string): Promise<string>
        function add(
            a: number | boolean | string,
            b: number | boolean | string,
        ): number | Promise<string> {
            if (typeof a === 'number' && typeof b === 'number') return a + b
            if (typeof a === 'string' && typeof b === 'string')
                return Promise.resolve(a + b)

            throw thrownError
        }

        const wrappedAdd = safeWrap(add)

        // case 1: adding numbers
        expectTypeOf(wrappedAdd(1, 2)).toEqualTypeOf<Result<number>>()
        expect(wrappedAdd(1, 2)).not.toBeInstanceOf(Promise)
        const [success1, result1, error1] = wrappedAdd(1, 2)

        expectTypeOf(success1).toEqualTypeOf<boolean>()
        expect(success1).toBe(true)

        expectTypeOf(result1).toEqualTypeOf<number | null>()
        expect(result1).toBe(3)

        expectTypeOf(error1).toEqualTypeOf<unknown>()
        expect(error1).toBeNull()

        // case 2: adding booleans
        expectTypeOf(wrappedAdd(true, true)).toEqualTypeOf<Failure>()
        expect(wrappedAdd(true, true)).not.toBeInstanceOf(Promise)
        const [success2, result2, error2] = wrappedAdd(true, true)

        expectTypeOf(success2).toEqualTypeOf<false>()
        expect(success2).toBe(false)

        expectTypeOf(result2).toEqualTypeOf<null>()
        expect(result2).toBeNull()

        expectTypeOf(error2).toEqualTypeOf<unknown>()
        expect(error2).toBe(thrownError)

        // case 3: adding strings
        expectTypeOf(wrappedAdd('1', '2')).toEqualTypeOf<
            Promise<Result<string>>
        >()
        expect(wrappedAdd('1', '2')).toBeInstanceOf(Promise)
        const [success3, result3, error3] = await wrappedAdd('1', '2')

        expectTypeOf(success3).toEqualTypeOf<boolean>()
        expect(success3).toBe(true)

        expectTypeOf(result3).toEqualTypeOf<string | null>()
        expect(result3).toBe('12')

        expectTypeOf(error3).toEqualTypeOf<unknown>()
        expect(error3).toBeNull()

        // case 4: invalid arguments
        // @ts-expect-error -- intentionally testing invalid arguments
        const _case4 = wrappedAdd(1, '2')
    })
})
