import { useEffect } from 'react';

export const useDidMount = (callback: () => void) => {
  useEffect(() => {
    if (typeof callback === 'function') {
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
