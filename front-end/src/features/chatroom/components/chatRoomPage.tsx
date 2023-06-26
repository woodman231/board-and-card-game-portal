import { useState } from "react";
import { socket } from '../../../socket';
import ChatMessages from "./chatMessages";

interface ChatRoomPageProps {
    messages: string[];
    roomCode: string;
}

const ChatRoomPage = ({messages, roomCode}: ChatRoomPageProps) => {
    const [newMessage, setNewMessage] = useState<string>('');

    function handleSendButtonClick() {
        socket.emit('sendMessage', {room: roomCode, message: newMessage});
        setNewMessage('');
    }

    return(
        <>
            <h1>Chat Room Page</h1>
            <p>Room Code: {roomCode}</p>
            <p>Connected: {socket.connected.toString()}</p>
            <ChatMessages messages={messages} />
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
            <button onClick={handleSendButtonClick}>Send</button>
        </>
    )
};

export default ChatRoomPage;