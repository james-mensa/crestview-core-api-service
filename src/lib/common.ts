/**
 * Generates a 4-character string based on the current timestamp.
 * The generated string consists of uppercase letters, lowercase letters, and digits.
 *
 * @returns {string} A 4-character string generated from the current timestamp.
 */
function generateTimeBasedString(): string {
    const timestamp: string = Date.now().toString(); // Current timestamp in string format
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';

    for (let i = 0; i < 4; i++) {
        // Calculate a random index based on the timestamp and current iteration
        const randomIndex: number = (parseInt(timestamp.charAt(i % timestamp.length), 10) + i) % characters.length;
        result += characters[randomIndex]; // Append the selected character to the result
    }

    return result;
}

/**
 * Takes a string, removes spaces, and concatenates it in lowercase.
 *
 * @param {string} input - The input string to process.
 * @returns {string} The concatenated and lowercased string.
 */
function normalizeAndConcatenate(input: string): string {
    return input.replace(/\s+/g, '').toLowerCase();
}

/**
 * Takes a full name string and returns the initials.
 *
 * @param {string} fullName - The full name to extract initials from.
 * @returns {string} The concatenated initials in uppercase.
 */
function getInitials(fullName: string): string {
    return fullName
        .split(' ') // Split the full name into an array of words
        .map(name => name[0].toUpperCase()) // Take the first character of each word and convert it to uppercase
        .join(''); // Join the initials together
}

export {
    generateTimeBasedString,
    normalizeAndConcatenate,
    getInitials
};
