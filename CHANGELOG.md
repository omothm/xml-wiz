# Changelog

## 1.2.0 (Sep 1, 2020)

New features:

- `localNs` &mdash; a new property that can be added to a node to indicate that the node's namespace declaration (which may already be added to the outermost root node) is to be added to the node itself as well.<br>This may be useful in cases where a branch of the XML tree is expected to be 'cut' from the tree and used alone.

## 1.1.1 (Aug 29, 2020)

Documentation:

- Update README to reflect new features

## 1.1.0 (Aug 29, 2020)

New features:

- Accepting single attributes in `attributes` as objects not wrapped in arrays.

## 1.0.4 (Aug 22, 2020)

Functionality:

- Updated namespace extraction code to be simpler and more robust
- Added sandbox files to Git and NPM ignore files

Documentation:

- Added inline documentation for `xmlWiz()`
- Added README file

Internal and tests:

- Changed function name to avoid conflict with a popular NPM package with the
  same name
- Added one test for `xmlWiz()`

## 1.0.3 (Aug 22, 2020)

- Updated license information

## 1.0.2 (Aug 22, 2020)

- Added more NPM exclusions

## 1.0.1 (Aug 22, 2020)

- Added NPM exclusions to reduce download size

## 1.0.0 (Aug 22, 2020)

- Initial release
