import { useEffect, RefObject } from 'react';

export function useSyncedScroll(
  a: RefObject<HTMLElement>, 
  b: RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!a.current || !b.current) return;
    
    let lock = false;
    
    const handleScrollA = () => {
      if (lock) return;
      lock = true;
      if (b.current) {
        b.current.scrollTop = a.current!.scrollTop;
      }
      lock = false;
    };
    
    const handleScrollB = () => {
      if (lock) return;
      lock = true;
      if (a.current) {
        a.current.scrollTop = b.current!.scrollTop;
      }
      lock = false;
    };
    
    a.current.addEventListener('scroll', handleScrollA);
    b.current.addEventListener('scroll', handleScrollB);
    
    return () => {
      a.current?.removeEventListener('scroll', handleScrollA);
      b.current?.removeEventListener('scroll', handleScrollB);
    };
  }, [a, b]);
}
