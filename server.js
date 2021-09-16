const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

const rooms = new Map();

app.get('/room/:id', (req, res) => {
  const { id: room } = req.params;
  const obj = rooms.has(room)
    ? {
        users: [...rooms.get(room).get('users').values()],
        messages: [...rooms.get(room).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post('/room', (req, res) => {
  const { room, user } = req.body;
  //console.log(room, user);
  if (!rooms.has(room)) {
    rooms.set(
      room,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send();
});

io.on('connection', (socket) => {
  socket.on('ROOM:ENTER', ({ room, user }) => {
    socket.join(room);
    rooms.get(room).get('users').set(socket.id, user);
    const users = [...rooms.get(room).get('users').values()];
    socket.to(room).broadcast.emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ room, user, time, text }) => {
    
    const obj = {
      user,
      time,
      text,
    };
    //console.log(obj);
    rooms.get(room).get('messages').push(obj);
    socket.to(room).broadcast.emit('ROOM:NEW_MESSAGE', obj);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, room) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(room).broadcast.emit('ROOM:SET_USERS', users);
      }
    });
  });

  //console.log('user connected', socket.id);
});

server.listen(8000, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
