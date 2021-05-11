import { useEffect } from 'react';

function useConnectionDetection(onConnect, onDisconnect) {
  useEffect(() => {
    window.addEventListener('online', onConnect);
    window.addEventListener('offline', onDisconnect);

    return () => {
      window.removeEventListener('online', onConnect);
      window.removeEventListener('offline', onDisconnect);
    };
  }, [onConnect, onDisconnect]);
}

export default useConnectionDetection;
