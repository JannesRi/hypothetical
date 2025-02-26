/* eslint-disable @typescript-eslint/prefer-promise-reject-errors -- testing */
/* eslint-disable @typescript-eslint/only-throw-error -- testing */
/* eslint-disable @typescript-eslint/require-await -- testing*/
import { describe, expect, expectTypeOf, it } from 'vitest'
import { safeTry, type Tryable } from './safeTry.ts'
import type { Failure, Result } from './types/Result.ts'

describe('safeTry', () => {
    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should not accept other values 1', () => {
        type Input<T> = T extends Tryable<unknown> ? true : false

        expectTypeOf<Input<() => unknown>>().toEqualTypeOf<true>()
        expectTypeOf<Input<Promise<unknown>>>().toEqualTypeOf<true>()

        expectTypeOf<Input<string>>().toEqualTypeOf<false>()
        expectTypeOf<Input<number>>().toEqualTypeOf<false>()
        expectTypeOf<Input<boolean>>().toEqualTypeOf<false>()
        expectTypeOf<Input<null>>().toEqualTypeOf<false>()
        expectTypeOf<Input<undefined>>().toEqualTypeOf<false>()
        expectTypeOf<Input<unknown>>().toEqualTypeOf<false>()
        expectTypeOf<Input<unknown[]>>().toEqualTypeOf<false>()
        expectTypeOf<Input<object>>().toEqualTypeOf<false>()
        expectTypeOf<Input<symbol>>().toEqualTypeOf<false>()
        expectTypeOf<Input<(a: string) => unknown>>().toEqualTypeOf<false>()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it.fails('should not accept other values 2', () => {
        const throwing = () => {
            throw new Error('error')
        }

        expectTypeOf(safeTry(throwing())).toEqualTypeOf<never>()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 1', () => {
        const fn = () => {
            throw new Error('error')

            return 'success'
        }

        expectTypeOf(safeTry<string, Error>(fn)).toEqualTypeOf<
            Result<string, Error>
        >()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 2', () => {
        const fn = () => {
            throw new Error('error')
        }

        expectTypeOf(safeTry<never, Error>(fn)).toEqualTypeOf<Failure<Error>>()
    })

    // eslint-disable-next-line vitest/expect-expect -- type testing
    it('should accept generics 3', () => {
        const fn = () => {
            return new Error('error')

            return 'success'
        }

        expectTypeOf(safeTry<Error | string, Error>(fn)).toEqualTypeOf<
            Result<string, Error>
        >()

        expectTypeOf(safeTry(fn, false)).toMatchTypeOf<Result<Error | string>>()
    })

    it("should return Result if the sync function doesn't throw", () => {
        const fn = () => 'success'

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Result<string>>()
        expect(safeTry(fn)).not.toBeInstanceOf(Promise)

        const [success, result, error] = safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<string | null>()
        expect(result).toBe('success')

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })

    it('should return Failure if the sync function just throws', () => {
        const thrownError = 'error'
        const fn = () => {
            throw thrownError
        }

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Failure>()
        expect(safeTry(fn)).not.toBeInstanceOf(Promise)

        const [success, result, error] = safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(thrownError)
    })

    it('should return Failure if the sync function just throws an Error', () => {
        const thrownError = new Error('error')
        const fn = () => {
            throw thrownError
        }

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Failure>()
        expect(safeTry(fn)).not.toBeInstanceOf(Promise)

        const [success, result, error] = safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeInstanceOf(Error)
        expect(error).toBe(thrownError)
    })

    it('should return Result if the sync function may throw', () => {
        const thrownError = new Error('error')
        const fn = (throwError: boolean) => {
            if (throwError) throw thrownError

            return 'success'
        }

        expectTypeOf(safeTry(() => fn(false))).toEqualTypeOf<Result<string>>()
        expect(safeTry(() => fn(false))).not.toBeInstanceOf(Promise)

        const [success1, result1, error1] = safeTry(() => fn(false))

        expectTypeOf(success1).toEqualTypeOf<boolean>()
        expect(success1).toBe(true)

        expectTypeOf(result1).toEqualTypeOf<string | null>()
        expect(result1).toBe('success')

        expectTypeOf(error1).toEqualTypeOf<unknown>()
        expect(error1).toBeNull()

        expectTypeOf(safeTry(() => fn(true))).toEqualTypeOf<Result<string>>()
        expect(safeTry(() => fn(true))).not.toBeInstanceOf(Promise)

        const [success2, result2, error2] = safeTry(() => fn(true))

        expectTypeOf(success2).toEqualTypeOf<boolean>()
        expect(success2).toBe(false)

        expectTypeOf(result2).toEqualTypeOf<string | null>()
        expect(result2).toBeNull()

        expectTypeOf(error2).toEqualTypeOf<unknown>()
        expect(error2).toBe(thrownError)
    })

    it('should return Failure if the sync function returns an error', () => {
        const returnedError = new Error('failure')
        const fn = () => returnedError

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Failure<Error>>()
        expect(safeTry(fn)).not.toBeInstanceOf(Promise)

        const [success, result, error] = safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<Error>()
        expect(error).toBeInstanceOf(Error)
        expect(error).toBe(returnedError)
    })

    it('should return Result if the sync function returns an error', () => {
        const returnedError = new Error('success')
        const fn = () => returnedError

        expectTypeOf(safeTry(fn, false)).toEqualTypeOf<Result<Error>>()
        expect(safeTry(fn, false)).not.toBeInstanceOf(Promise)

        const [success, result, error] = safeTry(fn, false)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<Error | null>()
        expect(result).toBeInstanceOf(Error)
        expect(result).toBe(returnedError)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })

    it('should return a Promise when called with an async function', async () => {
        const fn = async () => 'success'
        type Expected = Result<string>
        const expected = [true, 'success', null]

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Promise<Expected>>()
        expect(safeTry(fn)).toBeInstanceOf(Promise)
        expectTypeOf(await safeTry(fn)).toEqualTypeOf<Expected>()
        expect(await safeTry(fn)).toEqual(expected)

        expectTypeOf(safeTry(() => fn())).toEqualTypeOf<Promise<Expected>>()
        expect(safeTry(() => fn())).toBeInstanceOf(Promise)
        expectTypeOf(await safeTry(() => fn())).toEqualTypeOf<Expected>()
        expect(await safeTry(() => fn())).toEqual(expected)

        expectTypeOf(safeTry(async () => fn())).toEqualTypeOf<
            Promise<Expected>
        >()
        expect(safeTry(async () => fn())).toBeInstanceOf(Promise)
        expectTypeOf(await safeTry(async () => fn())).toEqualTypeOf<Expected>()
        expect(await safeTry(async () => fn())).toEqual(expected)
    })

    it("should return Result if the async function doesn't throw", async () => {
        const fn = async () => 'success'

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Promise<Result<string>>>()
        expect(safeTry(fn)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<string | null>()
        expect(result).toBe('success')

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })

    it('should return Failure if the async function just throws', async () => {
        const thrownError = 'error'
        const fn = async () => {
            throw thrownError
        }

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Promise<Failure>>()
        expect(safeTry(fn)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(thrownError)
    })

    it('should return Failure if the async function just throws an Error', async () => {
        const thrownError = new Error('error')
        const fn = async () => {
            throw thrownError
        }

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Promise<Failure>>()
        expect(safeTry(fn)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(thrownError)
    })

    it('should return Result if the async function may throw', async () => {
        const thrownError = new Error('error')
        const fn = async (throwError: boolean) => {
            if (throwError) throw thrownError

            return 'success'
        }

        expectTypeOf(safeTry(() => fn(false))).toEqualTypeOf<
            Promise<Result<string>>
        >()
        expect(safeTry(() => fn(false))).toBeInstanceOf(Promise)

        const [success1, result1, error1] = await safeTry(() => fn(false))

        expectTypeOf(success1).toEqualTypeOf<boolean>()
        expect(success1).toBe(true)

        expectTypeOf(result1).toEqualTypeOf<string | null>()
        expect(result1).toBe('success')

        expectTypeOf(error1).toEqualTypeOf<unknown>()
        expect(error1).toBeNull()

        expectTypeOf(safeTry(() => fn(true))).toEqualTypeOf<
            Promise<Result<string>>
        >()
        expect(safeTry(() => fn(true))).toBeInstanceOf(Promise)

        const [success2, result2, error2] = await safeTry(() => fn(true))

        expectTypeOf(success2).toEqualTypeOf<boolean>()
        expect(success2).toBe(false)

        expectTypeOf(result2).toEqualTypeOf<string | null>()
        expect(result2).toBeNull()

        expectTypeOf(error2).toEqualTypeOf<unknown>()
        expect(error2).toBe(thrownError)
    })

    it('should return Failure if the async function returns an error', async () => {
        const returnedError = new Error('failure')
        const fn = async () => returnedError

        expectTypeOf(safeTry(fn)).toEqualTypeOf<Promise<Failure<Error>>>()
        expect(safeTry(fn)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(fn)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<Error>()
        expect(error).toBeInstanceOf(Error)
        expect(error).toBe(returnedError)
    })

    it('should return Result if the async function returns an error', async () => {
        const returnedError = new Error('success')
        const fn = async () => returnedError

        expectTypeOf(safeTry(fn, false)).toEqualTypeOf<Promise<Result<Error>>>()
        expect(safeTry(fn, false)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(fn, false)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<Error | null>()
        expect(result).toBeInstanceOf(Error)
        expect(result).toBe(returnedError)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })

    it('should return Result if the promise is resolved successfully', async () => {
        const promise = Promise.resolve('success')

        expectTypeOf(safeTry(promise)).toEqualTypeOf<Promise<Result<string>>>()
        expect(safeTry(promise)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(promise)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<string | null>()
        expect(result).toBe('success')

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })

    it('should return Failure if the promise is rejected', async () => {
        const returnedError = 'failure'
        const promise = Promise.reject(returnedError)

        expectTypeOf(safeTry(promise)).toEqualTypeOf<Promise<Failure>>()
        expect(safeTry(promise)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(promise)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(returnedError)
    })

    it('should return Failure if the promise is rejected with an error', async () => {
        const returnedError = new Error('failure')
        const promise = Promise.reject(returnedError)

        expectTypeOf(safeTry(promise)).toEqualTypeOf<Promise<Failure>>()
        expect(safeTry(promise)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(promise)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBe(returnedError)
    })

    it('should return Failure if the promise resolves with an error', async () => {
        const returnedError = new Error('failure')
        const promise = Promise.resolve(returnedError)

        expectTypeOf(safeTry(promise)).toEqualTypeOf<Promise<Failure<Error>>>()
        expect(safeTry(promise)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(promise)

        expectTypeOf(success).toEqualTypeOf<false>()
        expect(success).toBe(false)

        expectTypeOf(result).toEqualTypeOf<null>()
        expect(result).toBeNull()

        expectTypeOf(error).toEqualTypeOf<Error>()
        expect(error).toBeInstanceOf(Error)
        expect(error).toBe(returnedError)
    })

    it('should return Result if the promise resolves with an error', async () => {
        const returnedError = new Error('success')
        const promise = Promise.resolve(returnedError)

        expectTypeOf(safeTry(promise, false)).toEqualTypeOf<
            Promise<Result<Error>>
        >()
        expect(safeTry(promise, false)).toBeInstanceOf(Promise)

        const [success, result, error] = await safeTry(promise, false)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<Error | null>()
        expect(result).toBeInstanceOf(Error)
        expect(result).toBe(returnedError)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })
})
