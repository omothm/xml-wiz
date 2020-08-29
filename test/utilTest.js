const assert = require('assert');
const util = require('../src/util');

describe('util', () => {
  describe('#arrayify()', () => {
    it('should return the same object if it is already an array', () => {
      const array = [1, 2, 3];
      assert.deepStrictEqual(util.arrayify(array), array);
    });
    it('should return object wrapped in an array if it is not an array', () => {
      const obj = '1';
      const wrapped = util.arrayify(obj);
      assert.strictEqual(Array.isArray(wrapped), true);
      assert.deepStrictEqual(wrapped[0], obj);
    });
  });
  describe('#isString()', () => {
    it('should return true when the value is a literal string', () => {
      assert.strictEqual(util.isString('literal string'), true);
    });
    it('should return true when the value is an object string', () => {
      // eslint-disable-next-line no-new-wrappers
      assert.strictEqual(util.isString(new String('some string')), true);
    });
    it('should return false when the value is an int', () => {
      assert.strictEqual(util.isString(5), false);
    });
  });
});
