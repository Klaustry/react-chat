import React from 'react';
import socket from '../socket';
import date from 'date-and-time';


function Chat({ users, messages, user, room, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    const now = new Date();
    const time = date.format(now, 'DD.MM.YY HH:mm');
    socket.emit('ROOM:NEW_MESSAGE', {
      room,
      user,
      time,
      text: messageValue,
    });
    onAddMessage({ user, time, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    messagesRef.current.scroll(0, messagesRef.current.scrollHeight);
  }, [messages]);

  return (
    <div>
      <h4 className="mb-4 text-center">Вы находитесь в чате-комнате: <b>{room}</b></h4>
      <h6 className="mb-4 text-center">Пригласить в чат: 
        <a href={ "/room/" + room } target="_blank" rel="noopener noreferrer">
         { window.location.host + "/room/" + room }
         </a>
      </h6>
    <div className="chat">
      
      <div className="chat-users">
        Вы: <b>{user}</b>
        <hr />
        <p>Онлайн ({users.length}):</p>
        <ul>
          {users.map((name, index) => (
            <li>{name}
                <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle text-center">
            </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {messages.map((message) => (
            <div className={(message.user === user) ? 'your-message' :  'message'}>
              <p>{message.text}<br/>
              </p>
              <div>
                <span>{(message.user === user) ? '(' + message.time + ') Вы' :  message.user + ' (' + message.time + ')'}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="1"></textarea>
              <button onClick={onSendMessage} type="button" className="btn btn-success ml-2 btn-send">
            Отправить
          </button>
          </div>
          
        </form>
      </div>
    </div>
    </div>
  );
}

export default Chat;
