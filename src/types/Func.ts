export type Func<P extends unknown[] = unknown[], R = unknown> = (
    ...args: [...P]
) => R
