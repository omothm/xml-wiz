# xml-wiz

[![npm version](https://badge.fury.io/js/xml-wiz.svg)](https://badge.fury.io/js/xml-wiz)

XML generator

**Main features:**

- Automatic namespace handling
- Function purity support

xml-wiz is an XML generator that focuses primarily on XML namespace handling.
Using xml-wiz, there is no need to add namespace declarations or prefixes
manually. It is sufficient to associate namespace URIs with nodes/attributes
and the generator will put in the declarations and prefixes automatically.

The API is designed with function purity in mind. Many common XML generators
(which are not JSON-based) require building all nodes and attributes in one
place. In cases where some branches of the XML tree are built in different
scopes, the XML object must around and altered as an argument, which breaks
functional purity. In this API, there are no builder objects. Every node is its
own JSON object. Child relations can be readily altered anywhere in the code,
allowing complex structures to originate from multiple sources without having to
pass a builder object around.

## Usage

The simplest example is as follows:

```js
const xmlWiz = require('xml-wiz');

const n1 = { name: 'Root' };
const n2 = { name: 'Child1' };
const n3 = { name: 'Child2' };
n1.children = [n2, n3];
const xml = xmlWiz(n1);
```

This generates the following XML (formatted for readability):

```xml
<Root>
  <Child1></Child1>
  <Child2></Child2>
</Root>
```

A more involved example with namespaces:

```js
const NS_A = 'http://example.com/a';
const NS_B = 'http://example.com/b';

const node1 = {
  name: 'Node1',
  ns: NS_B,
  children: 'Hello there!',
};
const node2 = {
  name: 'Node2',
};
const root = {
  name: 'Root',
  ns: NS_A,
  attributes: [{ name: 'attr1', ns: NS_A, value: '3' }],
  children: [node1, node2],
};
const xml = xmlWiz(root);
```

Generated XML (formatted for readability):

```xml
<ns1:Root
    xmlns:ns1="http://example.com/a"
    xmlns:ns2="http://example.com/b"
    ns1:attr1="3">
  <ns2:Node1>Hello there!</ns2:Node1>
  <Node2></Node2>
</ns1:Root>
```

Note that the prefixes (`ns1` and `ns2`) were not provided by the user, only the
URIs are provided. Prefixes are generated automatically.

## Nodes and attributes

`xmlWiz()` accepts a single object that represents the root node of the XML
tree. The root node may contain other nodes as children, and any node may
contain attributes. Node and attribute objects must contain the following keys
to work as expected.

### Node

| Key          | Type                                | Required | Description                                                                                                                                                       |
| :----------- | :---------------------------------- | :------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | string                              | **Yes**  | The name of the node.                                                                                                                                             |
| `ns`         | string                              |    No    | The namespace URI of the node (not a prefix).                                                                                                                     |
| `localNs`    | boolean                             |    No    | If `true`, the namespace declaration is added to the node (in addition to the root node).                                                                         |
| `attributes` | object \| list of objects           |    No    | A single attribute or a list of the attributes associated with this node (formatted as described in these docs).                                                  |
| `children`   | string \| object \| list of objects |    No    | &bullet; A string representing a textual content.<br>&bullet; An object representing a single child node.<br>&bullet; A list of objects representing child nodes. |

### Attribute

| Key     | Type   | Required | Description                                        |
| :------ | :----- | :------: | :------------------------------------------------- |
| `name`  | string | **Yes**  | The name of the attribute                          |
| `ns`    | string |    No    | The namespace URI of the attribute (not a prefix). |
| `value` | string | **Yes**  | The value of the attribute.                        |
