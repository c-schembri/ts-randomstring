# ts-randomstring

A simple Node-based library written in TypeScript that allows you to generate random strings (a)synchronously.

## Installation
NPM
```
npm install ts-randomstring
```

Yarn
```
yarn add ts-randomstring
```

## Usage
Consumers are able to use both synchronous and asynchrounous (via callback) functions and class methods.

Exported function examples:
```
import { generateRandomString } from "ts-randomstring/lib"

// Synchronously generate a random string via function.
const randomString = generateRandomString();
```
```
import { generateRandomStringAsync } from "ts-randomstring/lib"

// Asynchronously generate a random string via function and callback.
generateRandomStringAsync((error, randomString) => {
    if (error === undefined) {
        // Use your randomly generated string.
        console.log(randomString);
    } else {
        // Handle error.
        console.log(error);
    }
});
```
Exported class method examples:

```
import { RandomString } from "ts-randomstring/lib"

// Synchronously generate a random string via class method.
const randomString = new RandomString();
const rand = randomString.generate();
```

```
import { RandomString } from "ts-randomstring/lib"

// Asynchronously generate a random string via class method callback.
const randomString = new RandomString();
randomString.generateAsync((error, rand) => {
    if (error === undefined) {
        // Use your randomly generated string.
        console.log(rand);
    } else {
        // Handle error.
        console.log(error);
    }
});
```
Examples of random string options (demonstrated via functions):
```
import { generateRandomString } from "ts-randomstring/lib"

// Setting length.
const randomString = generateRandomString({
    length: 128
});
```
```
import { generateRandomString, CharacterSetType } from "ts-randomstring/lib"

// Setting length and character set.
const randomString = generateRandomString({
    length: 64,
    charSetType: CharacterSetType.Hex
});
```
```
import { generateRandomString, CharacterSetType, Capitalisation } from "ts-randomstring/lib"

// Setting length, character set, and capitalisation style.
const randomString = generateRandomString({
    length: 32,
    charSetType: CharacterSetType.Alphanumeric,
    capitalisation: Capitalisation.Uppercase
});
```

## Options in-depth

`length`: `number` (default=`32`); sets the length of the required random string

`charSetType`: `CharacterSetType` (default=`CharacterSetType.Alphanumeric`); sets the type of the character set used for random string generation.

`capitalisation`: `Capitalisation` (default=`Capitalisation.Mixed`); sets the capitalisation style of the random string.

#

Valid `CharacterSetType` and `Capitalisation` enum values:

`CharacterSetType`
- Alphanumeric
- Alphabetic
- Numeric
- Hex
- Binary
- Octal

`Capitalisation`
- Mixed
- Uppercase
- Lowercase