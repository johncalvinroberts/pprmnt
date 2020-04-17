export default (ms = 500) =>
  new Promise((resolve) => setTimeout(() => resolve(), ms));
