const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';

module.exports = { isString };
