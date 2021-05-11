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
            },
            on: {
              BOT_MESSAGE: [
                {
                  actions: 'chatMessage',
                  target: 'respondentsTurn',
                  cond: 'respondentsTurn'
                },
                {
                  actions: 'chatMessage',
                  target: 'botsTurn.typing'
                }
              ],
              END_CHAT: '#chat.finished'
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
        }
      },
      disconnected: {
        on: {
          CONNECT: 'chatting.history'
        }
      },
      finished: {
        type: 'final'
      }
    },
    on: {
      DISCONNECT: 'disconnected'
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
