# Bulwark

Bulwark makes handling errors easy.

## Installation

```sh
npm i bulwark
```

## Examples

### Try a sync function

```ts
import { safeTry } from "bulwark"

const divide = (a: number, b: number) => {
    if (b === 0) throw new Error('Cannot divide by zero')

    return a / b
}

const [success, result, error] = safeTry(() => divide(1, 0))
```

### Wrap a sync function

```ts
import { safeWrap } from "bulwark"

const divide = (a: number, b: number) => {
    if (b === 0) throw new Error('Cannot divide by zero')

    return a / b
}

const wrappedDivide = safeWrap(divide)
const [success, result, error] = wrappedDiv(1, 0)
```

### Try an async function

```ts
import { safeTry } from "bulwark"
import { readFile } from "node:fs/promises"

const [success, data, error] = await safeTry(readFile("nonexistent-file.txt"))
```

### Wrap an async function

```ts
import { safeWrap } from "bulwark"
import { readFile } from "node:fs/promises"

const safeReadFile = safeWrap((filename: string) => readFile(filename))

const [success, data, error] = await safeReadFile("nonexistent-file.txt")
```

### Try a promise

```ts
const promise = Promise.reject(new Error('failure'))

const [success, result, error] = await safeTry(promise)
```
