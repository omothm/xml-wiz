/* eslint-disable max-len */
const { arrayify, isString } = require('./util');

const getNamespaceSet = (node) => {
  const namespaces = new Set();
  if ('ns' in node) {
    namespaces.add(node.ns);
  }
  if ('attributes' in node) {
    const attributes = arrayify(node.attributes);
    attributes.forEach((attribute) => {
      if ('ns' in attribute) {
        namespaces.add(attribute.ns);
      }
    });
  }
  if ('children' in node) {
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        getNamespaceSet(child).forEach((ns) => namespaces.add(ns));
      });
    } else if (!isString(node.children)) {
      getNamespaceSet(node.children).forEach((ns) => namespaces.add(ns));
    }
  }
  return namespaces;
};

const xmlWizRecurse = (node, namespaceMap, isRoot = false) => {
  if (!node.name) {
    throw new Error('node does not have a `name` property');
  }
  let namespaceDeclarations = '';
  if (isRoot) {
    Object.entries(namespaceMap).forEach(([uri, prefix]) => {
      namespaceDeclarations += ` xmlns:${prefix}="${uri}"`;
    });
  } else if (node.localNs && 'ns' in node) {
    namespaceDeclarations += ` xmlns:${namespaceMap[node.ns]}="${node.ns}"`
  } 
  let attributesString = '';
  if ('attributes' in node) {
    const attributes = arrayify(node.attributes);
    attributes.forEach((attribute) => {
      const prefix = attribute.ns ? `${namespaceMap[attribute.ns]}:` : '';
      attributesString += ` ${prefix}${attribute.name}="${attribute.value}"`;
    });
  }
  const prefix = node.ns ? `${namespaceMap[node.ns]}:` : '';
  let string = `<${prefix}${node.name}${namespaceDeclarations}${attributesString}>`;
  if ('children' in node) {
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        string += xmlWizRecurse(child, namespaceMap);
      });
    } else if (isString(node.children)) {
      string += node.children;
    } else {
      string += xmlWizRecurse(node.children, namespaceMap);
    }
  }
  string += `</${prefix}${node.name}>`;
  return string;
};

/**
 * Generates an XML string for the structure whose root node is given.
 *
 * The function aggregates all namespace URIs in the whole tree, generates a numbered prefix for
 * each URI, and then prefixes all namespaced nodes/attributes with the generated prefixes. This
 * way, there is no need to worry about managing namespaces, it will be handled by the API.
 *
 * The format of the accepted XML node objects is as follows:
 *
 * |Key         |Type                               |Required|Description                                  |
 * |:-----------|:----------------------------------|:------:|:--------------------------------------------|
 * |`name`      |string                             |**Yes** |The name of the node.                        |
 * |`ns`        |string                             |No      |The namespace URI of the node (not a prefix).|
 * |`localNs`   |boolean                            |No      |If `true`, the namespace declaration is added to the node (in addition to the root node).|
 * |`attributes`|object \| list of objects          |No      |A single attribute or a list of the attributes associated with this node.|
 * |`children`  |string \| object \| list of objects|No      |A string representing a textual content of the node, an object representing a single child node, or a list of objects representing child nodes.|
 *
 * The format of the accepted XML attribute objects is as follows:
 *
 * |Key    |Type  |Required|Description                                       |
 * |:------|:-----|:------:|:-------------------------------------------------|
 * |`name` |string|**Yes** |The name of the attribute                         |
 * |`ns`   |string|No      |The namespace URI of the attribute (not a prefix).|
 * |`value`|string|**Yes** |The value of the attribute.                       |
 *
 * **NOTE** - `ns` does NOT expect a prefix, but the URI of the namespace. Prefixes will be
 * generated automatically.
 * @param {object} root - The root node of the XML structure.
 * @returns {string} An XML string.
 * @example
 * const NS_A = 'http://example.com/a';
 * const NS_B = 'http://example.com/b';
 * const node1 = { name: 'Node1', ns: NS_B, children: 'Hello there!' };
 * const node2 = { name: 'Node2'};
 * const root = {
 *   name: 'Root',
 *   ns: NS_A,
 *   attributes: [
 *     { name: 'attr1', ns: NS_A, value: '3' },
 *   ],
 *   children: [ node1, node2 ],
 * };
 * // returns: <ns1:Root xmlns:ns1="http://example.com/a" xmlns:ns2="http://example.com/b" ns1:attr1="3"><ns2:Node1>Hello there!</ns2:Node1><Node2></Node2></ns1:Root>
 * const xml = xmlWiz(root);
 */
const xmlWiz = (root) => {
  // Aggregate all namespaces to add them to the root node.
  const namespaceSet = getNamespaceSet(root);
  // Map each namespace to a prefix
  const namespaceMap = {};
  Array.from(namespaceSet).forEach((uri, idx) => {
    namespaceMap[uri] = `ns${idx + 1}`;
  });
  // Recurse the XML structure and generate XML strings.
  return xmlWizRecurse(root, namespaceMap, true);
};

module.exports = xmlWiz;
