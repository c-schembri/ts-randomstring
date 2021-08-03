import { randomBytes } from "crypto";
import { Capitalisation, Capitalization, CharacterSetType, getCharacterSet } from "./characterSetHandler";

/**
 * The base interface for random string options.
 */
interface RandomStringOptionsBase {
    length?: number;
    charSetType?: CharacterSetType;
}

/**
 * The interface for controlling the nature of random string generation (UK English).
 */
export interface RandomStringOptions extends RandomStringOptionsBase {
    capitalisation?: Capitalisation;
}

/**
 * The interface for controlling the nature of random string generation (US English).
 */
export interface RandomStringOptions extends RandomStringOptionsBase {
    capitalization?: Capitalization;
}

/**
 * The current state of the generated string, including its properties.
 * 
* @member `buffer`    The randomly generated buffer which is used as the base for random characters.
* @member `generated` The generated string.
* @member `charSet`   The character set which is used to determine valid characters for the generated string.
* @member `length`    The required character length of the generated string.
* @member `maxByte`   The maximum byte value used for generating random bytes (and characters thereby).
 */
interface GeneratedStringState {
    generated: string,
    charSet: string,
    length: number,
    maxByte: number
}

/**
 * Generates and returns a random string.
 * The optional random string options define the nature of the string to generated.
 * 
 * This method instantiates a new `RandomString` class before executing `generate`.
 * For multiple string generations, it is recommended to instantiate a `RandomString` instance yourself.
 * 
 * @param options  The random string options to parse and apply to string generation.
 *      Supported options:
 *      ```
 *          length:                        number (default=32)
 *          charSetType:                   CharacterSetType (default=CharacterSetType.Alphanumeric)
 *          capitalisation/capitalization: Capitalisation/Capitalization (default=Capitalisation.Mixed)
 *      ```
 * @returns The randomly generated string.
 */
export const generateRandomString = (options?: RandomStringOptions): string => {
    const randomString = new RandomString();
    return randomString.generate(options);
}

/**
 * Asynchronously generates a random string, executing the passed callback when generation is complete which contains the generated string.
 * The optional random string options define the nature of the string to generated.
 * 
 * This method instantiates a new `RandomString` class before executing `generateAsync`.
 * For multiple string generations, it is recommended to instantiate a `RandomString` instance yourself.
 * 
 * @param callback The callback (`error`, `generated`) to execute when generation is complete.
 * @param options  The random string options to parse and apply to string generation.
 *      Supported options:
 *      ```
 *          length:                        number (default=32)
 *          charSetType:                   CharacterSetType (default=CharacterSetType.Alphanumeric)
 *          capitalisation/capitalization: Capitalisation/Capitalization (default=Capitalisation.Mixed)
 *      ```
 * @returns void.
 */
export const generateRandomStringAsync = (callback: (error: Error | undefined, generated: string | undefined) => void, options?: RandomStringOptions): void => {
    const randomString = new RandomString();
    randomString.generateAsync(callback, options);
}


/**
 * The primary class for generating random strings.
 */
export class RandomString {
    /**
     * Generates and returns a random string.
     * The optional random string options define the nature of the string to generated.
     * 
     * @param options  The random string options to parse and apply to string generation.
     *      Supported options:
     *      ```
     *          length:                        number (default=32)
     *          charSetType:                   CharacterSetType (default=CharacterSetType.Alphanumeric)
     *          capitalisation/capitalization: Capitalisation/Capitalization (default=Capitalisation.Mixed)
     *      ```
     * @returns The randomly generated string.
     */
    public generate(options?: RandomStringOptions): string {
        const [length, charSetType, capitalisation] = this.parseOptions(options);
        const charSet = getCharacterSet(charSetType, capitalisation);

        let generated = "";
        while (generated.length < length) {
            const maxByte = this.getMaxByte(charSet.length);
            const buffer = this.getRandomBytesSafe(Math.ceil(length * 256 / maxByte));
            if (buffer instanceof(Error)) {
                return `getRandomBytesSafe internal error :: ${buffer}`;
            } else {
                const state: GeneratedStringState = {
                    generated, 
                    charSet, 
                    length, 
                    maxByte
                };

                generated = this.generateString(buffer, state);
            }
        }

        return generated;
    }

    /**
     * Asynchronously generates a random string, executing the passed callback when generation is complete which contains the generated string.
     * The optional random string options define the nature of the string to generated.
     * 
     * @param callback The callback (`error`, `generated`) to execute when generation is complete.
     * @param options  The random string options to parse and apply to string generation.
     *      Supported options:
     *      ```
     *          length:                        number (default=32)
     *          charSetType:                   CharacterSetType (default=CharacterSetType.Alphanumeric)
     *          capitalisation/capitalization: Capitalisation/Capitalization (default=Capitalisation.Mixed)
     *      ```
     * @returns void.
     */
    public generateAsync(callback: (error: Error | undefined, generated: string | undefined) => void, options?: RandomStringOptions): void {
        const [length, charSetType, capitalisation] = this.parseOptions(options);
        const charSet = getCharacterSet(charSetType, capitalisation);
        const state: GeneratedStringState = {
            generated: "", 
            charSet, 
            length, 
            maxByte: this.getMaxByte(charSet.length)
        };

        this.generateStringAsync(state, callback);
    }

    /**
     * Parses the passed random string options, returning their values if specified or their default values if not.
     * 
     * @param options The random string options to parse.
     * @returns The parsed options values.
     */
    private parseOptions(options?: RandomStringOptions): [number, CharacterSetType, Capitalisation] {
        return [
            options?.length ?? 32, 
            options?.charSetType ?? CharacterSetType.Alphanumeric, 
            options?.capitalisation ?? Capitalisation.Mixed
        ];
    }

    /**
     * Returns the maximum byte for a particular character set.
     * 
     * @param length The length of the current character set (i.e., the unique characters in the set).
     * @returns The maximum byte value.
     */
    private getMaxByte(length: number): number {
        return 256 - (256 % length);
    }

    /**
     * Safely attempts to generate a buffer of randomly generated bytes.
     * 
     * @param length    The required buffer length of the randomly generated buffer.
     * @returns The randomly generated buffer or an error if an error is caught.
     */
    private getRandomBytesSafe(length: number): Buffer | Error {
        try {
            return randomBytes(length);
        } catch (error) {
            return error;
        }
    }

    /**
     * Generates a random string.
     * @param buffer The randomly generated buffer which is used as the base for random characters.
     * @param state  See {@link GeneratedStringState} for generated string state documentation.
     * @returns The generated string.
     */
    private generateString(buffer: Buffer, state: GeneratedStringState): string {
        for (let i = 0; i < buffer.length && state.generated.length < state.length; i++) {
            const randomByte = buffer.readUInt8(i);
            if (randomByte < state.maxByte) {
                state.generated += state.charSet.charAt(randomByte % state.charSet.length);
            }
        }

        return state.generated;
    }

    /**
     * Generates a random string asynchronously. That is, the passed callback is executed when generation completes
     * 
     * @param state  See {@link GeneratedStringState} for generated string state documentation.
     * @param callback  The callback (`error`, `generated`) executed when string generation is complete.
     * @returns void.
     */
    private generateStringAsync(state: GeneratedStringState, callback: (error: Error | undefined, generated: string | undefined) => void): void {
        randomBytes(length, (error, buffer) => {
            if (error) {
                callback(error, undefined);
            }

            const newGenerated = this.generateString(buffer, state);
            if (newGenerated.length < length) {
                this.generateStringAsync(state, callback);
            } else {
                callback(undefined, newGenerated);
            }
        });
    }
}