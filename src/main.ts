type Func<P = unknown, R = unknown> = (...args: P[]) => R
type AsyncFunc<P = unknown, R = unknown> = Func<P, Promise<R>>

const isAsyncFunction = (fn: Func): fn is AsyncFunc => {
    return fn.constructor.name === 'AsyncFunction'
}

type Tryable = Promise<unknown> | Func | AsyncFunc
