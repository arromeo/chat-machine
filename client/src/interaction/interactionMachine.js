import { Machine } from 'xstate';
import { assign } from '@xstate/immer';

export const states = {
  BOT_TURN: 'interactionState/botTurn',
  RESPONDENT_TURN: 'interactionState/respondentTurn'
};

export const events = {
  BOT_MESSAGE: 'interactionEvent/botMessage',
  RESPONDENT_MESSAGE: 'interactionEvent/respondentMessage'
};

export const actions = {
  CHAT_MESSAGE: 'interactionAction/botMessage',
  SWITCH_TO_RESPONDENT: 'interactionAction/swithToRespondent'
};

export const guards = {
  RESPONDENTS_TURN: 'interactionGuard/respondentsTurn'
};

export const interactionMachine = Machine(
  {
    id: 'interaction',
    initial: states.BOT_TURN,
    context: {
      chat: [],
      messages: {}
    },
    states: {
      [states.BOT_TURN]: {},
      [states.RESPONDENT_TURN]: {
        on: {
          [events.RESPONDENT_MESSAGE]: {
            target: states.BOT_TURN,
            actions: actions.CHAT_MESSAGE
          }
        }
      }
    },
    on: {
      [events.BOT_MESSAGE]: [
        {
          target: states.RESPONDENT_TURN,
          cond: guards.RESPONDENTS_TURN,
          actions: actions.CHAT_MESSAGE
        },
        {
          actions: actions.CHAT_MESSAGE
        }
      ]
    }
  },
  {
    actions: {
      [actions.CHAT_MESSAGE]: assign((ctx, evt) => {
        const { messageId, sender, text } = evt;
        ctx.messages[messageId] = { id: messageId, sender, text };
        ctx.chat.push(messageId);
      })
    },
    guards: {
      [guards.RESPONDENTS_TURN]: (_, evt) => evt.isQuestion
    }
  }
);
