import { useState, useEffect, RefObject } from 'react';

export const useResize = (ref: RefObject<any>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = () => {
    setWidth(ref.current.offsetWidth);
    setHeight(ref.current.offsetHeight);
  }

  useEffect(() => {
    const current = ref.current;
    current && current.addEventListener('resize', handleResize);
    return () => {
      current.removeEventListener('resize', handleResize);
    }
  });

  return [width, height];
}
  