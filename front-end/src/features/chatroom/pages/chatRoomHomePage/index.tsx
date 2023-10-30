import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTypedSelector, useAppDispatch } from "../../../../store";
import { setChatRoomCode } from "../../reducers/chatReducer";
import { socket } from "../../../../socket";
import DefaultLayout from "../../../defaultLayout/components/defaultLayout";
import SignInButton from "../../../common/components/signInButton";
import CreateChatRoomButton from "./components/createChatRoomButton";
import JoinChatRoom from "./components/joinChatRoom";

function ChatRoomHomePage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { isLoggedIn, user } = useTypedSelector(state => state.auth);
    const pageTitle = "Chat Room Home Page";
    const pageDescription = "The starting place for a chat room";

    useEffect(() => {
        function onRoomCreatedReply(data: {roomCode: string}) {            
            dispatch(setChatRoomCode(data.roomCode));
            navigate(`/chatroom/${data.roomCode}`);
        }
        
        socket.on('roomCreatedReply', onRoomCreatedReply);        

        return () => {            
            socket.off('roomCreatedReply', onRoomCreatedReply);            
        }
    }, [dispatch, navigate]);

    if (!isLoggedIn || !user) {
        return (
            <DefaultLayout pageTitle={pageTitle} pageDescription={pageDescription}>
                <p>You must be logged in to use this feature</p>
                <SignInButton />
            </DefaultLayout>
        )
    }

    return (
        <>
            <DefaultLayout pageTitle={pageTitle} pageDescription={pageDescription}>
                <p className="mb-2">Welcome {user.displayName}. What would you like to do?</p>
                <CreateChatRoomButton />
                <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-extrabold">OR</p>
                </div>
                <JoinChatRoom />
            </DefaultLayout>
        </>
    );
}

export default ChatRoomHomePage;
