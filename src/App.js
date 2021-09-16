import React from 'react';
import axios from 'axios';
import socket from './socket';
import store from './store';
import Login from './components/Login';
import Chat from './components/Chat';

function App() {
  const [state, dispatch] = React.useReducer(store, {
    joined: false,
    room: null,
    user: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => {
    dispatch({
      type: 'ENTERED',
      payload: obj,
    });
    socket.emit('ROOM:ENTER', obj);
    const { data } = await axios.get(`/room/${obj.room}`);
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', addMessage);
  }, []);


  return (
    <div className="main">
      {!state.joined ? (
        <Login onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
