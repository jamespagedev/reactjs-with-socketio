import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket = io('localhost:3002/');

function App() {
  // variables
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // functions
  const connectToRoom = () => {
    console.log('button clicked');
    setLoggedIn(true);
    socket.emit('join_room', room); // join_room copied from backend
  }

  const sendMessage = () => {
    const data = {
      room: room,
      content: {
        author: userName,
        message: message
      }
    }
    Promise.resolve(socket.emit('send_message', data))
    .then(() => setMessage(''));
  }

  // setup
  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data);
    });
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
        <div className="chatContainer">
          <div className="messages">
            <h1>{room}</h1>
            {messageList.map((messageInfo, index) => 
              <div key={index} className="messageBox">
                <p>{messageInfo.author}:&nbsp;{messageInfo.message}</p>
              </div>
            )}
          </div>
          <div className="messageInputs">
            <input type="text" placeholder="Message..." value={message} onChange={ev => setMessage(ev.target.value)} />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
