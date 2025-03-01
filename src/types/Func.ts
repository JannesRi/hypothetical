// eslint-disable-next-line @typescript-eslint/no-explicit-any -- better type inference than `unknown`
export type Func<P extends any[] = any[], R = any> = (...args: [...P]) => R
