// import { describe, expect, expectTypeOf, it } from 'vitest'
// import type { Result } from './types/Result.ts'
// import { wrap } from './wrap.ts'

// describe('wrap', () => {
//     const add = (a: number, b: number) => a + b
//     const div = (a: number, b: number) => {
//         if (b === 0) throw new Error('Cannot divide by zero')

//         return a / b
//     }

//     it('should wrap a function', () => {
//         const wrappedAdd = wrap(add)

//         expectTypeOf(wrappedAdd).toEqualTypeOf<
//             (a: number, b: number) => Result<number>
//         >()

//         expect(wrappedAdd(1, 2)).toBe(3)
//     })
// })
