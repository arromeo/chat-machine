import { createContext, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useMachine } from '@xstate/react';
import { events, interactionMachine } from './interactionMachine';
import { useSocket } from './useSocket';

export const InteractionContext = createContext({});

export function InteractionProvider(props) {
  const { children } = props;

  const [state, send] = useMachine(interactionMachine);

  const botMessage = useCallback(
    (evt) =>
      send({
        type: events.BOT_MESSAGE,
        ...evt
      }),
    [send]
  );

  const { sendMessage } = useSocket(botMessage);

  const respondentMessage = useCallback(
    (text) => {
      send({
        type: events.RESPONDENT_MESSAGE,
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
    state: state.value
  };

  return (
    <InteractionContext.Provider value={contextValue}>
      {children}
    </InteractionContext.Provider>
  );
}
