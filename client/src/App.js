import { useRef } from 'react';
import { useInteraction } from './interaction';

function ProgressiveTyping(props) {
  const { state } = props;
  return <div style={{ color: 'green' }}>[{state}]</div>;
}

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
      {state.value.chatting?.botsTurn && (
        <ProgressiveTyping state={state.value.chatting.botsTurn} />
      )}
      {state.value === 'disconnected' && (
        <div style={{ color: 'purple' }}>[Disconnected]</div>
      )}
      {state.value.chatting === 'respondentsTurn' && (
        <div>
          <input ref={inputRef} type="text" />
          <button onClick={submitMessage}>Submit</button>
        </div>
      )}
    </div>
  );
}

export default App;
