import { Machine } from 'xstate';
import { assign } from '@xstate/immer';

export const interactionMachine = Machine(
  {
    id: 'chat',
    initial: 'initializing',
    context: {
      chat: [],
      messages: {}
    },
    states: {
      initializing: {
        on: {
          START_CHAT: 'chatting.botsTurn.typing'
        }
      },
      chatting: {
        states: {
          botsTurn: {
            initial: 'typing',
            states: {
              typing: {
                after: {
                  4000: 'thinking'
                }
              },
              thinking: {
                after: {
                  4000: 'collecting'
                }
              },
              collecting: {
                after: {
                  8000: 'apology'
                }
              },
              apology: {}
            }
          },
          respondentsTurn: {
            on: {
              RESPONDENT_MESSAGE: {
                target: 'botsTurn',
                actions: 'chatMessage'
              }
            }
          },
          history: {
            type: 'history'
          }
        },
        on: {
          BOT_MESSAGE: [
            {
              actions: 'chatMessage',
              target: 'chatting.respondentsTurn',
              cond: 'respondentsTurn'
            },
            {
              actions: 'chatMessage',
              target: 'chatting.botsTurn.typing'
            }
          ]
        }
      },
      disconnected: {},
      finished: {
        type: 'final'
      }
    },
    on: {
      DISCONNECT: 'disconnected',
      CONNECT: 'chatting.history'
    }
  },
  {
    actions: {
      chatMessage: assign((ctx, evt) => {
        const { messageId, sender, text } = evt;
        ctx.messages[messageId] = { id: messageId, sender, text };
        ctx.chat.push(messageId);
      })
    },
    guards: {
      respondentsTurn: (_, evt) => evt.isQuestion
    }
  }
);
