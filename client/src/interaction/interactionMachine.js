import { Machine } from 'xstate';
import { assign } from '@xstate/immer';

export const interactionStates = {
  BOT_TURN: 'interactionState/botTurn',
  RESPONDENT_TURN: 'interactionState/respondentTurn'
};

export const interactionEvents = {
  BOT_MESSAGE: 'interactionEvent/botMessage',
  RESPONDENT_MESSAGE: 'interactionEvent/respondentMessage'
};

export const interactionActions = {
  CHAT_MESSAGE: 'interactionAction/botMessage',
  SWITCH_TO_RESPONDENT: 'interactionAction/swithToRespondent'
};

export const interactionGuards = {
  RESPONDENTS_TURN: 'interactionGuard/respondentsTurn'
};

export const interactionMachine = Machine(
  {
    id: 'interaction',
    initial: interactionStates.BOT_TURN,
    context: {
      chat: [],
      messages: {}
    },
    states: {
      [interactionStates.BOT_TURN]: {},
      [interactionStates.RESPONDENT_TURN]: {
        on: {
          [interactionEvents.RESPONDENT_MESSAGE]: {
            target: interactionStates.BOT_TURN,
            actions: interactionActions.CHAT_MESSAGE
          }
        }
      }
    },
    on: {
      [interactionEvents.BOT_MESSAGE]: [
        {
          target: interactionStates.RESPONDENT_TURN,
          cond: interactionGuards.RESPONDENTS_TURN,
          actions: interactionActions.CHAT_MESSAGE
        },
        {
          actions: interactionActions.CHAT_MESSAGE
        }
      ]
    }
  },
  {
    actions: {
      [interactionActions.CHAT_MESSAGE]: assign((ctx, evt) => {
        const { messageId, sender, text } = evt;
        ctx.messages[messageId] = { id: messageId, sender, text };
        ctx.chat.push(messageId);
      })
    },
    guards: {
      [interactionGuards.RESPONDENTS_TURN]: (_, evt) => evt.isQuestion
    }
  }
);
