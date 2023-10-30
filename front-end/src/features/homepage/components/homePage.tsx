import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { socket } from '../../../socket';
import { useNavigate } from 'react-router-dom';
import { useGetUserDataQuery } from "../../auth/services/authService"
import { selectIsLoggedIn, selectUser } from "../../auth/reducers/authReducer";
import DefaultLayout from '../../defaultLayout/components/defaultLayout';
import Greeting from '../../common/components/greeting';
import { useTypedSelector } from "../../../store"
import { Link } from 'react-router-dom';

// interface HomePageProps {
//     isConnected: boolean;    
//     setRoomCode:  React.Dispatch<React.SetStateAction<string>>;    
// }

// const HomePage = ({isConnected, setRoomCode}: HomePageProps) => {
//     const navigate = useNavigate();

//     const [joinRoomCode, setJoinRoomCode] = React.useState<string>('');

//     useGetUserDataQuery();
//     const isLoggedIn = useSelector(selectIsLoggedIn);
//     const user = useSelector(selectUser);

//     function handleSendButtonClick() {        
//         socket.emit('hello');
//     }

//     function handleCreateRoomButtonClick() {
//         socket.emit('createNewRoom');
//     }

//     function handleJoinRoomButtonClick() {
//         setRoomCode(joinRoomCode)
//         navigate(`/chatroom/${joinRoomCode}`);
//     }

//     useEffect(() => {
//         function onRoomCreatedReply(data: {roomCode: string}) {
//             console.log("onRoomCreatedReply triggered with data: ", data);
//             setRoomCode(data.roomCode);
//             navigate(`/chatroom/${data.roomCode}`);
//         }

//         socket.on('roomCreatedReply', onRoomCreatedReply);

//         return () => {
//             socket.off('roomCreatedReply', onRoomCreatedReply);
//         }
//     }, []);

//     if(isLoggedIn && user && !isConnected) {
//         return(
//             <>
//                 <p>Welcome {user.username}. You are logged in, but you are not connected to the socket.iop server</p>
//                 <button onClick={() => socket.connect()}>Connect</button>
//             </>            
//         )
//     }

//     if(isLoggedIn && user && isConnected) {
//         return (
//             <>
//                 <div>
//                     <p>Connected 
//                         <button onClick={() => socket.disconnect()}>Disconnect</button>
//                         <button onClick={handleSendButtonClick}>Send Hello</button>
//                     </p>
//                 </div>
//                 <div>
//                     <button onClick={handleCreateRoomButtonClick}>Create Room</button>
//                 </div>
//                 <div>
//                     <input type="text" placeholder="Room Code" value={joinRoomCode} onChange={(e) => setJoinRoomCode(e.target.value)} />
//                     <button onClick={handleJoinRoomButtonClick}>Join Room</button>
//                 </div>
//             </>            
//         )
//     }

//     return (
//         <>
//             <h1 className="text-3xl font-bold underline">
//                 Welcome to the Chat App
//             </h1>
//             <p><a href="/auth/github">Login with GitHub</a></p>
//         </>        
//     )
// }

// export default HomePage;

const HomePage = () => {

    const { isLoggedIn } = useTypedSelector(state => state.auth);

    return (
        <DefaultLayout pageTitle='Board and Card Game Portal' pageDescription='The home page of the Board and Card Game Portal'>
            <Greeting />
            {
                isLoggedIn && (
                    <ul className='list-disc ml-4'>
                        <li>
                            <Link to='/chatroom'>Go to Chat Room</Link>                            
                        </li>
                        <li>
                            <Link to="/named-socket-test">Go to Named Socket Test</Link>
                        </li>
                    </ul>
                )
            }
        </DefaultLayout>
    )
}

export default HomePage;