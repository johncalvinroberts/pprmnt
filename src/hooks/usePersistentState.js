import { useState, useEffect, useMemo } from 'react';

/**
 * usePersistentState -- like useState, but persists to localstorage
 */

export default (key, defaultValue) => {
  const initialValue = useMemo(
    () => localStorage.getItem(key) || defaultValue,
    [defaultValue, key],
  );

  const [state, setState] = useState(initialValue);

  // update the value in localstorage every time the state value changes
  useEffect(() => {
    localStorage.setItem(key, state);
  }, [key, state]);

  return [state, setState];
};
