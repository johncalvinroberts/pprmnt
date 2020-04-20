export default (file) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.addEventListener('loadend', () => resolve(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsArrayBuffer(file);
  });
};
