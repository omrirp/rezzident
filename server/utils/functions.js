/**
 * This function takes a string and returns the same
 * string with upper cased first character
 * @param str: string 
 * @returns: string
 */
export const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1, str.length);
};
