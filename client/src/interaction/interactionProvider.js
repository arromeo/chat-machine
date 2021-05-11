import { createContext, useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useMachine } from '@xstate/react';
import { interactionMachine } from './interactionMachine';
import { useSocket } from './useSocket';
import useConnectionDetection from '../hooks/useConnectionDetection';

export const InteractionContext = createContext({});

export function InteractionProvider(props) {
  const { children } = props;

  const [state, send] = useMachine(interactionMachine);

  useEffect(() => {
    send('START_CHAT');
  }, [send]);

  const botMessage = useCallback(
    (evt) =>
      send({
        type: 'BOT_MESSAGE',
        ...evt
      }),
    [send]
  );

  const { sendMessage } = useSocket(botMessage);

  const respondentMessage = useCallback(
    (text) => {
      send({
        type: 'RESPONDENT_MESSAGE',
        messageId: uuid(),
        sender: 'respondent',
        text
      });
      sendMessage(text);
    },
    [send, sendMessage]
  );

  const contextValue = {
    botMessage,
    messages: state.context.chat.map(
      (messageId) => state.context.messages[messageId]
    ),
    respondentMessage,
    state
  };

  const disconnect = useCallback(() => {
    send('DISCONNECT');
  }, [send]);

  const reconnect = useCallback(() => {
    send('CONNECT');
  }, [send]);

  useConnectionDetection(reconnect, disconnect);

  return (
    <InteractionContext.Provider value={contextValue}>
      {children}
    </InteractionContext.Provider>
  );
}
