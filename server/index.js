const express = require("express");
const ws = require("ws");
const faker = require("faker");
const { v4: uuid } = require("uuid");
const { random_bm, random_denominator } = require("./utils");

const app = express();

async function randomDelay() {
  const delay = 2000 + Math.abs(random_bm() * 5000);

  return new Promise((resolve) => setTimeout(resolve, delay));
}

const wsServer = new ws.Server({ noServer: true });
wsServer.on("connection", (socket) => {
  setTimeout(() => wsServer.close(), 10000);
  let waiting = false;

  function createMessage() {
    return JSON.stringify({
      messageId: uuid(),
      dateTime: new Date().getTime(),
      text: faker.lorem.sentence(),
      isQuestion: waiting,
      sender: "bot",
    });
  }

  function sendBotMessages() {
    while (!waiting) {
      waiting = random_denominator(2);
      socket.send(createMessage());
    }
  }

  async function receiveMessage() {
    if (waiting) {
      waiting = false;
      await randomDelay();
      return sendBotMessages();
    }
  }

  socket.on("message", receiveMessage);

  sendBotMessages();
});

const server = app.listen(3010, () => console.log("listening on port 3000..."));
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
