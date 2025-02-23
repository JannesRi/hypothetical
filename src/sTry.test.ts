/* eslint-disable @typescript-eslint/prefer-promise-reject-errors -- testing */
/* eslint-disable @typescript-eslint/only-throw-error -- testing */
/* eslint-disable @typescript-eslint/require-await -- testing*/
import { describe, expect, expectTypeOf, it } from 'vitest'
import { sTry } from './sTry.ts'
import type { Failure, Result } from './types/Result.ts'

describe('sTry', () => {
    it("should return Result if the sync function doesn't throw", () => {
        const fn = () => 'success'

        expectTypeOf(sTry(fn)).toEqualTypeOf<Result<string>>()
        const [success, result, error] = sTry(fn)

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Failure>()
        const [success, result, error] = sTry(fn)

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Failure>()
        const [success, result, error] = sTry(fn)

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

        expectTypeOf(sTry(() => fn(false))).toEqualTypeOf<Result<string>>()
        const [success1, result1, error1] = sTry(() => fn(false))

        expectTypeOf(success1).toEqualTypeOf<boolean>()
        expect(success1).toBe(true)

        expectTypeOf(result1).toEqualTypeOf<string | null>()
        expect(result1).toBe('success')

        expectTypeOf(error1).toEqualTypeOf<unknown>()
        expect(error1).toBeNull()

        expectTypeOf(sTry(() => fn(true))).toEqualTypeOf<Result<string>>()
        const [success2, result2, error2] = sTry(() => fn(true))

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Failure<Error>>()
        const [success, result, error] = sTry(fn)

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

        expectTypeOf(sTry(fn, false)).toEqualTypeOf<Result<Error>>()
        const [success, result, error] = sTry(fn, false)

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Promise<Expected>>()
        expectTypeOf(await sTry(fn)).toEqualTypeOf<Expected>()
        expect(await sTry(fn)).toEqual(expected)

        expectTypeOf(sTry(() => fn())).toEqualTypeOf<Promise<Expected>>()
        expectTypeOf(await sTry(() => fn())).toEqualTypeOf<Expected>()
        expect(await sTry(() => fn())).toEqual(expected)

        expectTypeOf(sTry(async () => fn())).toEqualTypeOf<Promise<Expected>>()
        expectTypeOf(await sTry(async () => fn())).toEqualTypeOf<Expected>()
        expect(await sTry(async () => fn())).toEqual(expected)
    })

    it("should return Result if the async function doesn't throw", async () => {
        const fn = async () => 'success'

        expectTypeOf(sTry(fn)).toEqualTypeOf<Promise<Result<string>>>()
        const [success, result, error] = await sTry(fn)

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Promise<Failure>>()
        const [success, result, error] = await sTry(fn)

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Promise<Failure>>()
        const [success, result, error] = await sTry(fn)

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

        expectTypeOf(sTry(() => fn(false))).toEqualTypeOf<
            Promise<Result<string>>
        >()
        const [success1, result1, error1] = await sTry(() => fn(false))

        expectTypeOf(success1).toEqualTypeOf<boolean>()
        expect(success1).toBe(true)

        expectTypeOf(result1).toEqualTypeOf<string | null>()
        expect(result1).toBe('success')

        expectTypeOf(error1).toEqualTypeOf<unknown>()
        expect(error1).toBeNull()

        expectTypeOf(sTry(() => fn(true))).toEqualTypeOf<
            Promise<Result<string>>
        >()
        const [success2, result2, error2] = await sTry(() => fn(true))

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

        expectTypeOf(sTry(fn)).toEqualTypeOf<Promise<Failure<Error>>>()
        const [success, result, error] = await sTry(fn)

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

        expectTypeOf(sTry(fn, false)).toEqualTypeOf<Promise<Result<Error>>>()
        const [success, result, error] = await sTry(fn, false)

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

        expectTypeOf(sTry(promise)).toEqualTypeOf<Promise<Result<string>>>()
        const [success, result, error] = await sTry(promise)

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

        expectTypeOf(sTry(promise)).toEqualTypeOf<Promise<Failure>>()
        const [success, result, error] = await sTry(promise)

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

        expectTypeOf(sTry(promise)).toEqualTypeOf<Promise<Failure>>()
        const [success, result, error] = await sTry(promise)

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

        expectTypeOf(sTry(promise)).toEqualTypeOf<Promise<Failure<Error>>>()
        const [success, result, error] = await sTry(promise)

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

        expectTypeOf(sTry(promise, false)).toEqualTypeOf<
            Promise<Result<Error>>
        >()
        const [success, result, error] = await sTry(promise, false)

        expectTypeOf(success).toEqualTypeOf<boolean>()
        expect(success).toBe(true)

        expectTypeOf(result).toEqualTypeOf<Error | null>()
        expect(result).toBeInstanceOf(Error)
        expect(result).toBe(returnedError)

        expectTypeOf(error).toEqualTypeOf<unknown>()
        expect(error).toBeNull()
    })
})
