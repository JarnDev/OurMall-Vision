export const stringToArray = function (string) {
    const re = /,| /;
    return string.split(re).filter(tag => (tag !== ''))
}