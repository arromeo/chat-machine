import { useCallback, useEffect, useRef } from 'react';
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';

function dynamicDelay(msg) {
  return of(msg).pipe(delay(msg.text.length * 30));
}

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

    subject.current.pipe(concatMap(dynamicDelay)).subscribe(
      botMessage,
      (err) => subject.current.reconnect(),
      () => console.log('complete')
    );

    return () => subject.current.complete();
  }, [botMessage]);

  const sendMessage = useCallback((message) => {
    subject.current.next({ message });
  }, []);

  return {
    sendMessage
  };
}
