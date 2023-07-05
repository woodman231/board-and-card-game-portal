import { useEffect, useState } from "react";
import { socket } from '../../../../socket';
import { Stage, Layer, Star } from 'react-konva';
import { useTypedSelector, useAppDispatch } from "../../../../store";
import { addMessage, setStars, StarShape } from "../../reducers/chatReducer";
import DefaultLayout from "../../../defaultLayout/components/defaultLayout";
import ChatMessages from "./components/chatMessages";

const ChatRoomPage = () => {
    const dispatch = useAppDispatch();

    const [newMessage, setNewMessage] = useState<string>('');
    const { chatRoomCode, messages: messagesFromSelector, stars } = useTypedSelector(state => state.chat);

    function handleSendButtonClick() {
        socket.emit('sendMessage', { room: chatRoomCode, message: newMessage });
        setNewMessage('');
    }

    useEffect(() => {
        const onMessageReceived = (data: { message: string }) => {
            dispatch(addMessage(data.message));
        }

        const onStarsReceived = (data: { starShapes: StarShape }) => {
            dispatch(setStars(data.starShapes));
        }

        socket.on("message", onMessageReceived);
        socket.on("setStarShapes", onStarsReceived);

        return () => {
            socket.off("message", onMessageReceived);
            socket.off("setStarShapes", onStarsReceived);
        }
    }, []);

    useEffect(() => {
        socket.emit('joinRoom', { roomCode: chatRoomCode });
    }, [chatRoomCode])

    return (
        <DefaultLayout pageTitle="Chat Room" pageDescription="A Chat Room">
            {/* <h1>Chat Room Page</h1>
            <p>Room Code: {chatRoomCode}</p>
            <p>Connected: {socket.connected.toString()}</p>
            <ChatMessages messages={messagesFromSelector} />
            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} /> */}
            {/* <button onClick={handleSendButtonClick}>Send</button> */}
            {
                stars && stars.length > 0 && (
                    <div className="flex justify-center py-1">
                        <Stage width={340} height={512} className="bg-white border border-black">
                            <Layer>
                                {stars.map((star) => (
                                    <Star
                                        key={star.id}
                                        x={star.x}
                                        y={star.y}
                                        numPoints={5}
                                        innerRadius={20}
                                        outerRadius={40}
                                        fill="#89b717"
                                        opacity={0.8}
                                        draggable
                                        rotation={star.rotation}
                                        shadowColor="black"
                                        shadowBlur={10}
                                        shadowOpacity={0.6}
                                        shadowOffsetX={star.isDragging ? 10 : 5}
                                        shadowOffsetY={star.isDragging ? 10 : 5}
                                        scaleX={star.isDragging ? 1.2 : 1}
                                        scaleY={star.isDragging ? 1.2 : 1}
                                        onDragStart={() => {
                                            const updatedStars = stars.slice();
                                            const starIndex = updatedStars.findIndex((s) => s.id === star.id);
                                            updatedStars.splice(starIndex, 1, { ...star, isDragging: true });

                                            socket.emit('setStarShapes', { roomCode: chatRoomCode, starShapes: updatedStars });
                                        }}
                                        onDragEnd={(e) => {
                                            const updatedStars = stars.slice();
                                            const starIndex = updatedStars.findIndex((s) => s.id === star.id);
                                            updatedStars.splice(starIndex, 1, { ...star, isDragging: false, x: e.target.x(), y: e.target.y() });

                                            socket.emit('setStarShapes', { roomCode: chatRoomCode, starShapes: updatedStars });
                                        }}
                                        onDragMove={(e) => {
                                            const updatedStars = stars.slice();
                                            const starIndex = updatedStars.findIndex((s) => s.id === star.id);
                                            updatedStars.splice(starIndex, 1, { ...star, x: e.target.x(), y: e.target.y() });

                                            socket.emit('setStarShapes', { roomCode: chatRoomCode, starShapes: updatedStars });
                                        }}
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                )
            }
        </DefaultLayout>
    )
};

export default ChatRoomPage;