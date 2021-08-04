import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;

function App() {
  // variables
  const [loggedIn] = useState(false);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');

  // functions
  const connectToRoom = () => {
    console.log('button clicked');
    socket.emit('join_room', room); // join_room copied from backend
  }

  // setup
  useEffect(() => {
    socket = io('localhost:3002/');
  }, []);

  return (
    <div className="App">
      {!loggedIn ?
        <div className="logIn">
          <div className="inputs">
            <input type="text" placeholder="Name..." value={userName} onChange={ev => setUserName(ev.target.value)} />
            <input type="text" placeholder="Room..." value={room} onChange={ev => setRoom(ev.target.value)} />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div> :
        <h1>You Are Logged In</h1>
      }
    </div>
  );
}

export default App;
