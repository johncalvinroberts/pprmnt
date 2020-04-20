export default (array) => {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset,
  );
};
