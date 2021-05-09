import { useCallback, useEffect, useRef } from 'react';
import { webSocket } from 'rxjs/webSocket';

/**
 * Sets up socket connection and returns a callback to send messages over the
 * socket. Preferrably, this will be more robust with features like
 * auto-reconnect.
 *
 * This function is also very specific to this use case and can be made more
 * generic in the future.
 */
export function useSocket(botMessage) {
  const subject = useRef();

  useEffect(() => {
    subject.current = webSocket('ws://localhost:3010');

    subject.current.subscribe(
      botMessage,
      (err) => console.log(err),
      () => console.log('complete')
    );

    return () => subject.current.complete();
  }, [botMessage]);

  const sendMessage = useCallback((message) => {
    subject.current?.next({ message });
  }, []);

  return {
    sendMessage
  };
}
