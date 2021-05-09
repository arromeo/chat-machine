import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { InteractionProvider } from './interaction';

ReactDOM.render(
  <React.StrictMode>
    <InteractionProvider>
      <App />
    </InteractionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
