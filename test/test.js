const assert = require('assert');
const xmlWiz = require('../src');

describe('xmlWiz()', () => {
  it('should build a valid XML (example 1)', () => {
    const n1 = { name: 'Root' };
    const n2 = { name: 'Child1' };
    const n3 = { name: 'Child2' };
    n1.children = [n2, n3];

    const expected = '<Root><Child1></Child1><Child2></Child2></Root>';
    assert.strictEqual(xmlWiz(n1), expected);
  });
  it('should build a valid XML (example 2)', () => {
    const n1 = {
      name: 'Root',
      ns: 'http://ns1.com',
      attributes: [
        {
          name: 'attr2',
          value: 'Yes',
          ns: 'http://ns5.com',
        },
      ],
    };

    const n2 = {
      name: 'Child1',
      ns: 'http://ns1.com',
      attributes: [
        {
          name: 'attr1',
          value: '3',
          ns: 'http://ns2.com',
        },
      ],
    };

    const n3 = {
      name: 'Child2',
      ns: 'http://ns2.com',
    };

    n3.children = 'Test3';
    n1.children = [n2, n3];

    const expected = '<ns1:Root xmlns:ns1="http://ns1.com" xmlns:ns2="http://ns5.com" xmlns:ns3="http://ns2.com" ns2:attr2="Yes"><ns1:Child1 ns3:attr1="3"></ns1:Child1><ns3:Child2>Test3</ns3:Child2></ns1:Root>';
    assert.strictEqual(xmlWiz(n1), expected);
  });
  it('should build a valid XML when a single attr is not wrapped in an array', () => {
    const n1 = { name: 'Root' };
    const n2 = { name: 'Child1' };
    const n3 = {
      name: 'Child2',
      attributes: { name: 'attr', value: 3 },
    };
    n1.children = [n2, n3];

    const expected = '<Root><Child1></Child1><Child2 attr="3"></Child2></Root>';
    assert.strictEqual(xmlWiz(n1), expected);
  });
  it('should add namespace locally when localNs is used', () => {
    const n1 = {
      name: 'Root',
      ns: 'http://ns1.com',
      attributes: [
        {
          name: 'attr2',
          value: 'Yes',
          ns: 'http://ns5.com',
        },
      ],
    };

    const n2 = {
      name: 'Child1',
      ns: 'http://ns1.com',
      attributes: [
        {
          name: 'attr1',
          value: '3',
          ns: 'http://ns2.com',
        },
      ],
    };

    const n3 = {
      name: 'Child2',
      ns: 'http://ns2.com',
      localNs: true,
      children: 'Test3',
    };

    n1.children = [n2, n3];

    const expected = '<ns1:Root xmlns:ns1="http://ns1.com" xmlns:ns2="http://ns5.com" xmlns:ns3="http://ns2.com" ns2:attr2="Yes"><ns1:Child1 ns3:attr1="3"></ns1:Child1><ns3:Child2 xmlns:ns3="http://ns2.com">Test3</ns3:Child2></ns1:Root>';
    assert.strictEqual(xmlWiz(n1), expected);
  });
});
