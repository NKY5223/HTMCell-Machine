const chars = Array.from("");
function encode(number = 0) {
    if (typeof number !== "number") throw new TypeError(`Expected number, got ${number}`);
    if (number < 0 || !Number.isInteger(number)) throw new RangeError(`Expected nonnegative integer, got ${number}`)
    let string = "";
    while (number > 0) {
        string = String(number % 74) + string;
        number = Math.floor(number / 74);
    }
    return string;
}
function decode(string = "0") { 
    if (typeof string !== "string") throw new TypeError(`Expected string, got ${string}`);
    if (string.match(/[^0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!$%&+-.=?^{}]/)) throw new RangeError(`Found character not in base74 set`);
    let number = 0;
    while (string.length) {
        number *= 74;
        number += chars.indexOf(string[0]);
        string = string.substr(1);
    }
    return number;
}
export { chars, encode, decode };