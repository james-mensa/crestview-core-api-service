/**
 * Generates a 4-character string based on the current timestamp.
 * The generated string consists of uppercase letters, lowercase letters, and digits.
 *
 * @returns {string} A 4-character string generated from the current timestamp.
 */
function generateTimeBasedString() {
    const timestamp = Date.now().toString(); // Current timestamp in string format
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 4; i++) {
        // Calculate a random index based on the timestamp and current iteration
        const randomIndex = (parseInt(timestamp.charAt(i % timestamp.length), 10) + i) % characters.length;
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
function normalizeAndConcatenate(input) {
    return input.replace(/\s+/g, '').toLowerCase();
}


module.exports={
    generateTimeBasedString,
    normalizeAndConcatenate

}