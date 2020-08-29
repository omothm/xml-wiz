const arrayify = (obj) => (Array.isArray(obj) ? obj : [obj]);

const isString = (obj) => Object.prototype.toString.call(obj) === '[object String]';

module.exports = { arrayify, isString };
