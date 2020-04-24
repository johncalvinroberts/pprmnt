import { useEffect } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

const removeDocumentMeta = () => {
  const nodes = document.querySelectorAll('head [data-use-head]');
  nodes.forEach((node) => node.parentNode.removeChild(node));
};

const insertDocumentMetaNode = (name, entry) => {
  const newNode = document.createElement('meta');
  /* eslint-disable no-restricted-syntax */
  for (const prop in entry) {
    if (entry[prop]) {
      newNode.setAttribute('name', name);
      newNode.setAttribute(prop, entry[prop]);
    }
  }
  /* eslint-enable no-restricted-syntax */
  newNode.setAttribute('data-use-head', '');
  document.getElementsByTagName('head')[0].appendChild(newNode);
};

const insertDocumentMeta = (nodes) => {
  removeDocumentMeta();
  Object.keys(nodes).forEach((name) =>
    insertDocumentMetaNode(name, nodes[name]),
  );
};

export default ({ title, meta = {} }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  useDeepCompareEffect(() => {
    insertDocumentMeta(meta);
    return () => removeDocumentMeta();
  }, [meta]);
};
