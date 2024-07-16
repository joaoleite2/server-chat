import React, { useEffect, useState } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import './Chat.css';
import Input from "../Input/Input";
import InfoBar from "../InforBar/InforBar";
import Messages from "../Messages/Messages";

let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState('');
  const ENDPOINT = 'http://localhost:5000';
  
  const location = useLocation();

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);
    
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        alert(error);
      }
    });

    return () => {
      socket.off();
    }
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((msgs) => [...msgs, message]);
    });
    
    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar roomName={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  );
}

export default Chat;
