import React from 'react';
import axios from 'axios';

function Login({ onLogin }) {
 
  const [user, setUser] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  const url = window.location.href;
  let room = (url.match("/room/(.*)")) ? 
                    (url.match("/room/(.*)")[1]) : 
                      window.location.href = url + "/room/" + 
                        Math.floor(Math.random() * 9000000) + 1;
  

  const onEnter = async () => {
    if (!user) {
      return alert('Введите ник');
    } 
    const obj = {
      room,
      user,
    };
    setLoading(true);
    await axios.post('/room', obj);
    onLogin(obj);
  };

  return (
    <div className="login">
       
      <input
        type="text"
        placeholder="Введите ник"
        value={user}
        onChange={(e) => { setUser(e.target.value);}}
      />
      <button disabled={isLoading} onClick={onEnter} className="btn btn-success">
        {isLoading ? 'Соединение...' : 'Войти в чат'}
      </button>
    </div>
  );
}

export default Login;
