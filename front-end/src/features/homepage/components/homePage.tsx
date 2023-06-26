import React, { useEffect } from 'react';
import { socket } from '../../../socket';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
    isConnected: boolean;
    roomCode: string;
    setRoomCode:  React.Dispatch<React.SetStateAction<string>>;    
}

const HomePage = ({isConnected, roomCode, setRoomCode}: HomePageProps) => {
    const navigate = useNavigate();

    function handleSendButtonClick() {
        console.log("sending hello");
        socket.emit('hello');
    }

    function handleCreateRoomButtonClick() {
        socket.emit('createNewRoom');
    }

    function handleJoinRoomButtonClick() {
        navigate(`/chatroom/${roomCode}`);
    }

    useEffect(() => {

    }, []);

    if(isConnected) {
        return (
            <>
                <div>
                    <p>Connected 
                        <button onClick={() => socket.disconnect()}>Disconnect</button>
                        <button onClick={handleSendButtonClick}>Send Hello</button>
                    </p>
                </div>
                <div>
                    <button onClick={handleCreateRoomButtonClick}>Create Room</button>
                </div>
                <div>
                    <input type="text" placeholder="Room Code" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
                    <button onClick={handleJoinRoomButtonClick}>Join Room</button>
                </div>
            </>            
        )
    }

    return (
        <p>Disconnected <button onClick={() => socket.connect()}>Connect</button></p>
    )
}

export default HomePage;