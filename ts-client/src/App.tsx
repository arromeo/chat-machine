import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { SocketProvider } from "./utils/socket";

const SOCKET_URL = "ws://localhost:3010";

function App() {
  return (
    <div className="App">
      <SocketProvider url={SOCKET_URL}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </SocketProvider>
    </div>
  );
}

export default App;
