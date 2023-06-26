import { useState, useEffect } from 'react';
import { socket } from './socket';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './features/homepage/components/homePage'
import ChatRoomPage from './features/chatroom/components/chatRoomPage'

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [roomCode, setRoomCode] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {    
    function onConnect() {
      socket.emit('hello');
      setIsConnected(true);
    }

    function onRoomCreatedReply(data: {roomCode: string}) {
        console.log("onRoomCreatedReply triggered with data: ", data);
        setRoomCode(data.roomCode);
    }

    function onMessage({message}: {message: string}) {
        console.log("onMessage triggered with message: ", message);
        setMessages( messages => [...messages, message] );
    }

    function onDisconnect() {
        setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('roomCreatedReply', onRoomCreatedReply);
    socket.on('message', onMessage);
    socket.on('disconnect', onDisconnect);

    return () => {
        socket.off('connect', onConnect);
        socket.off('roomCreatedReply', onRoomCreatedReply);
        socket.off('message', onMessage);
        socket.off('disconnect', onDisconnect);
    }

  }, [])

  useEffect(() => {
    setIsConnected(socket.connected);
  }, [socket.connected]);

  useEffect(() => {
    console.log("roomCode changed to: ", roomCode);
    if(roomCode) {
      socket.emit('joinRoom', {roomCode: roomCode});
    }
  }, [roomCode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage roomCode={roomCode} setRoomCode={setRoomCode} isConnected={isConnected} />} />
        <Route path="/chatroom/:roomCode" element={<ChatRoomPage roomCode={roomCode} messages={messages} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
