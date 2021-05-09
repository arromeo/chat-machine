const express = require('express');
const ws = require('ws');
const faker = require('faker');
const { v4: uuid } = require('uuid');

const app = express();

const channelId = uuid();
const chatId = uuid();

function random(denominator) {
  return Math.random() < 1 / denominator;
}

const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', (socket) => {
  let waiting = false;

  function createMessage() {
    return JSON.stringify({
      messageId: uuid(),
      channelId,
      chatId,
      dateTime: new Date().getTime(),
      text: faker.lorem.sentence(),
      isQuestion: waiting,
      sender: 'bot'
    });
  }

  function sendMessage() {
    if (!waiting) {
      waiting = random(3);
      socket.send(createMessage());
    }
  }

  function receiveMessage(message) {
    if (waiting) {
      waiting = false;
      console.log('msg received:', message);
    }
  }

  socket.on('message', receiveMessage);

  const intervalRef = setInterval(sendMessage, 1000);

  socket.on('close', () => {
    clearInterval(intervalRef);
  });
});

const server = app.listen(3010, () => console.log('listening on port 3000...'));
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request);
  });
});
