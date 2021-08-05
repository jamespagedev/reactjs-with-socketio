import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('localhost:3002/');

function App() {
  // variables
  const [loginInfo, setLoginInfo] = useState({isLoggedIn: false, user: '', room: ''});
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  // functions
  const connectToRoom = () => {
    const newLoginInfo = {isLoggedIn: true, user: userName, room: roomName};
    Promise.resolve(setLoginInfo(newLoginInfo))
    .then(() => socket.emit('join_room', newLoginInfo)); // join_room copied from backend
  }

  const sendMessage = async() => {
    const data = {
      room: loginInfo.room,
      content: {
        author: loginInfo.user,
        message: message
      }
    }
    const newMessageList = [...messageList, data.content]
    await socket.emit('send_message', data);
    await setMessageList(newMessageList); // this only updates on your browser but not everyone elses
    setMessage('');
  }

  // setup
  useEffect(() => {
      socket.on('receive_message', res => {
        setMessageList(res); // this only updates on everyone else browser except yours
      });
  }, []);

  return (
    <div className="App">
      {!loginInfo.isLoggedIn ?
        <div className="logIn">
          <div className="inputs">
            <input type="text" placeholder="Name..." value={userName} onChange={ev => setUserName(ev.target.value)} />
            <input type="text" placeholder="Room..." value={roomName} onChange={ev => setRoomName(ev.target.value)} />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div> :
        <div className="chatContainer">
          <div className="messages">
            <h1>{loginInfo.room}</h1>
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
