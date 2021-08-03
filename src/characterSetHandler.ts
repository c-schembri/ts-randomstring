/**
 * Enumerates through every supported character set type for random string generation.
 */
export enum CharacterSetType {
    Alphanumeric,
    Alphabetic,
    Numeric,
    Hex,
    Binary,
    Octal
}

/**
 * Enumerates through every supported capitalisation style for random string generation.
 */
export enum Capitalisation {
    Mixed,
    Uppercase,
    Lowercase
}
export { Capitalisation as Capitalization }

/**
 * Gets the character set by virtue of the passed character set type and capitalisation style.
 * 
 * @param charSetType     The character set type to pull characters from.
 * @param capitalisation  The character capitalisation style.
 * @returns Returns a string of unique characters which represent the character set.
 */
export const getCharacterSet = (charSetType: CharacterSetType, capitalisation: Capitalisation): string => {
    let charSet = "";
    const numbers = "0123456789";
    const charsLower = "abcdefghijklmnopqrstuvwxyz";
    const charsUpper = charsLower.toUpperCase();

    switch (charSetType) {
    case CharacterSetType.Alphanumeric: 
        charSet = numbers + charsLower + charsUpper; 
        break;

    case CharacterSetType.Alphabetic:
        charSet = charsLower + charsUpper; 
        break;
        
    case CharacterSetType.Numeric:
        charSet = numbers; 
        break;
        
    case CharacterSetType.Hex:
        charSet = numbers + "abcdef"; 
        break;
        
    case CharacterSetType.Binary:
        charSet = "01"; 
        break;
        
    case CharacterSetType.Octal:
        charSet = "01234567"; 
        break;
    }

    if (capitalisation === Capitalisation.Uppercase) {
        charSet = charSet.toUpperCase();
    } else if (capitalisation === Capitalisation.Lowercase) {
        charSet = charSet.toLowerCase();
    }

    return charSet;
}