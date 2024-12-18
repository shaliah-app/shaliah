/**
 * Removes all special characters from a string,
 * returning only its letters and numbers.
 * 
 * @param string with special characters
 * @returns modified string
 */
export function lettersAndNumbers(string: string) {
  const regex = /[^a-zA-Z0-9]/g; // Matches any character that's not a letter or number
  return string.replace(regex, "");
}
