import { useRef } from 'react';
import { useInteraction, interactionStates } from './interaction';

function App() {
  const inputRef = useRef();
  const { messages, respondentMessage, state } = useInteraction();

  function submitMessage() {
    respondentMessage(inputRef.current.value);
    inputRef.current.value = '';
  }

  return (
    <div>
      {messages.map((message) => (
        <div
          key={message.id}
          style={
            message.sender === 'bot' ? { color: 'blue' } : { color: 'red' }
          }
        >
          {message.text}
        </div>
      ))}
      {state === interactionStates.RESPONDENT_TURN && (
        <div>
          <input ref={inputRef} type="text" />
          <button onClick={submitMessage}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App;
