# S-Try

S-Try simplifies error handling by providing a structured, predictable way to execute functions safely.

## Why should you use S-Try?

Handling errors in JavaScript can be tedious. Traditional `try-catch` blocks add boilerplate and make code harder to read. **S-Try** offers a clean, structured way to handle errors with a guard-clause-like syntax:

```ts
const [success, result, error] = safeTry(thisCouldBeYourFunction)
if (!success) {
    console.error(error)
    return
}
```

## Features

- ✅ **Safe execution:** Run synchronous and asynchronous functions without unexpected crashes
- 🔄 **Wrap functions for automatic error handling:** No need for excessive `try-catch` blocks
- 🏷️ **TypeScript support:** Fully typed for better developer experience

## Use Cases

- Handling errors in **API calls** without excessive `try-catch` blocks
- Ensuring **file operations** fail safely
- Wrapping **database queries** for predictable error handling

## Design

S-Try standardizes error handling by returning predictable tuple structures, making it easier to work with functions that may fail. Data is returned in the following formats:

- **Success**: [true, result, null]
- **Failure**: [false, null, error]

Thus, the data can easily be [destructured](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment):

```ts
import { safeTry } from 's-try'

const [success, result, error] = safeTry(thisCouldBeYourFunction)
```

## Design Decisions

### Why the boolean?

JavaScript allows throwing non-Error values, such as `null`. This makes distinguishing between a failed execution and a valid return value difficult.

```ts
const mightThrow = () => {
    if (Math.random() > 0.5) throw null

    return null
}
```

In this example, you can't determine whether the function executed successfully or failed based solely on its return or thrown value. Early on it was decided to not modify the returned data.

To address this, S-Try introduces a **status boolean** (`true` for success, `false` for failure), ensuring predictable error handling.

### Why are returned errors counted as failures?

Returning errors instead of throwing them can improve type safety. This forces the developer to explicitly handle the error case, [as TypeScript will not notify the developer about thrown errors](https://github.com/microsoft/TypeScript/issues/13219).

However, if you do not like this behavior you can disable it through the `treatReturnedErrorsAsThrown` parameter:

```ts
import { safeTry } from 's-try'

const fn = () => new Error('failure')

const [success, result, error] = safeTry(fn, false)
```

## Installation

```sh
npm i s-try
```

## Getting Started

After installing **S-Try**, simply import and use it:

```ts
import { safeTry } from 's-try'

const [success, result, error] = safeTry(thisCouldBeYourFunction)
```

**Ensure you pass a function reference, not the function call itself:**
✅ `safeTry(thisCouldBeYourFunction)`
❌ `safeTry(thisCouldBeYourFunction())`

## Examples

### Try a synchronous function

```ts
import { safeTry } from 's-try'

const divide = (a: number, b: number) => {
    if (b === 0) throw new Error('Cannot divide by zero')

    return a / b
}

const [success, result, error] = safeTry(() => divide(1, 0))
```

### Try an asynchronous function

```ts
import { safeTry } from 's-try'
import { readFile } from 'node:fs/promises'

const [success, result, error] = await safeTry(readFile('nonexistent-file.txt'))
```

### Try a promise

```ts
import { safeTry } from 's-try'

const promise = Promise.reject(new Error('failure'))

const [success, result, error] = await safeTry(promise)
```

### Wrap a synchronous function

```ts
import { safeWrap } from 's-try'

const divide = (a: number, b: number) => {
    if (b === 0) throw new Error('Cannot divide by zero')

    return a / b
}

const wrappedDivide = safeWrap(divide)
const [success, result, error] = wrappedDivide(1, 0)
```

### Wrap an asynchronous function

```ts
import { safeWrap } from 's-try'
import { readFile } from 'node:fs/promises'

const safeReadFile = safeWrap((filename: string) => readFile(filename))
const [success, result, error] = await safeReadFile('nonexistent-file.txt')
```
