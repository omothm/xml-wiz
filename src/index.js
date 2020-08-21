const { isString } = require('./util');

const processNamespace = (entity, namespaces) => {
  let ns = '';
  let isNewNamespace = false;
  if (entity.ns) {
    ns = namespaces[entity.ns];
    if (!ns) {
      ns = `ns${Object.keys(namespaces).length + 1}`;
      isNewNamespace = true;
    }
  }
  return { ns, isNewNamespace };
};

const extractNamespaces = (node, _namespaces) => {
  const namespaces = _namespaces; // to keep the function pure
  let { ns, isNewNamespace } = processNamespace(node, namespaces);
  if (isNewNamespace) {
    namespaces[node.ns] = ns;
  }
  if ('attributes' in node) {
    node.attributes.forEach((attribute) => {
      ({ ns, isNewNamespace } = processNamespace(attribute, namespaces));
      if (isNewNamespace) {
        namespaces[attribute.ns] = ns;
      }
    });
  }
  if ('children' in node) {
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        extractNamespaces(child, namespaces);
      });
    } else if (!isString(node.children)) {
      extractNamespaces(node.children, namespaces);
    }
  }
  return namespaces;
};

const xmlWizRecurse = (node, namespaces, isRoot = false) => {
  if (!node.name) {
    throw new Error('node does not have a `name` property');
  }
  let namespaceDeclarations = '';
  if (isRoot) {
    Object.entries(namespaces).forEach(([uri, prefix]) => {
      namespaceDeclarations += ` xmlns:${prefix}="${uri}"`;
    });
  }
  let attributes = '';
  if ('attributes' in node) {
    node.attributes.forEach((attribute) => {
      const prefix = attribute.ns ? `${namespaces[attribute.ns]}:` : '';
      attributes += ` ${prefix}${attribute.name}="${attribute.value}"`;
    });
  }
  const prefix = node.ns ? `${namespaces[node.ns]}:` : '';
  let string = `<${prefix}${node.name}${namespaceDeclarations}${attributes}>`;
  if ('children' in node) {
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => {
        string += xmlWizRecurse(child, namespaces);
      });
    } else if (isString(node.children)) {
      string += node.children;
    } else {
      string += xmlWizRecurse(node.children, namespaces);
    }
  }
  string += `</${prefix}${node.name}>`;
  return string;
};

const xmlWiz = (node) => {
  const namespaces = extractNamespaces(node, {});
  return xmlWizRecurse(node, namespaces, true);
};

module.exports = xmlWiz;
