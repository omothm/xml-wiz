const assert = require('assert');
const util = require('../src/util');

describe('util', () => {
  describe('#isString()', () => {
    it('should return true when the value is a literal string', () => {
      assert.strictEqual(util.isString('literal string'), true);
    });
    it('should return true when the value is an object string', () => {
      // eslint-disable-next-line no-new-wrappers
      assert.strictEqual(util.isString(new String('some string')), true);
    });
  });
});
