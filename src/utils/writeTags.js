import ID3Writer from 'browser-id3-writer';
import { SUPPORTED_TAGS, FRAME_TYPES } from '../constants';
import isString from './isString';
import isObject from './isObject';
import isNumber from './isNumber';
import typedArrayToBuffer from './typedArrayToBuffer';

function validateTag(tag, value) {
  const expectedType = SUPPORTED_TAGS[tag];

  if (!expectedType) return false;

  switch (expectedType) {
    case 'array':
      return Array.isArray(value);
    case 'object':
      return isObject(value);
    case 'string':
      return isString(value);
    case 'integer':
      return isNumber(value);
    default:
      break;
  }
}

export default async (uInt8Array, tags) => {
  const buff = typedArrayToBuffer(uInt8Array);
  let ret;
  try {
    const writer = new ID3Writer(buff);

    // eslint-disable-next-line no-restricted-syntax, prefer-const
    for (let [key, value] of Object.entries(tags)) {
      const tag = FRAME_TYPES[key];
      const isValid = validateTag(tag, value);
      if (isValid) {
        try {
          writer.setFrame(tag, value);
        } catch (error) {
          // do nothing here, just skip the tag
        }
      }
    }
    writer.addTag();
    ret = new Uint8Array(writer.arrayBuffer);
  } catch (error) {
    ret = uInt8Array;
  }
  return ret;
};
