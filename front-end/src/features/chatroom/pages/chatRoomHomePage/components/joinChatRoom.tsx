import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../../../../store";
import { setChatRoomCode as setChatRoomCodeState } from "../../../reducers/chatReducer";

function JoinChatRoom() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [chatRoomCode, setChatRoomCode] = useState<string>('');

    const handleJoinChatRoomButtonClick = () => {
        dispatch(setChatRoomCodeState(chatRoomCode));
        navigate(`/chatroom/${chatRoomCode}`);
    };

    return ( 
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-lg font-semibold text-gray-500">Join a Chat Room</h1>
            <div>
                <input 
                    type="text" 
                    className="bg-slate-500 border border-slate-800 p-2" 
                    placeholder="Enter a chat room code"
                    value={chatRoomCode}
                    onChange={(e) => setChatRoomCode(e.currentTarget.value)} />
            </div>
            <div className="my-2">
                <button className='bg-yellow-500 rounded px-2' onClick={handleJoinChatRoomButtonClick}>Join</button>
            </div>
        </div>
    );
}

export default JoinChatRoom;