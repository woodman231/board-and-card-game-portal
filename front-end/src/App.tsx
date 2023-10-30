import { useEffect } from 'react';
import { socket } from './socket';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './features/homepage/components/homePage';
import ChatRoomPage from './features/chatroom/pages/chatRoomPage';
import ChatRoomHomePage from './features/chatroom/pages/chatRoomHomePage';
import NamedSocketTest from './features/namedSocketTest';
import { useGetUserDataQuery } from './features/auth/services/authService';
import { useTypedSelector } from './store';

interface StarShape {
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

function App() {  

  const { isLoggedIn, user } = useTypedSelector(state => state.auth);  

  useGetUserDataQuery();  

  useEffect(() => {
    if (isLoggedIn && user) {
      socket.connect();
    }
  }, [isLoggedIn, user]);


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatroom" element={<ChatRoomHomePage />} />
        <Route path="/chatroom/:roomCode" element={<ChatRoomPage />} />
        <Route path="/named-socket-test" element={<NamedSocketTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
