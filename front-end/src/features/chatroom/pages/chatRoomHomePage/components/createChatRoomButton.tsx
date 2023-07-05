import { ArrowRightCircleIcon } from "@heroicons/react/24/solid"
import { socket } from "../../../../../socket";

function CreateChatRoomButton() {
    const handleCreateChatRoomButtonClick = () => {
        socket.emit('createNewRoom');
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <p className="text-lg font-semibold text-gray-500">Create a chat room</p>
                <div className="flex items-center justify-center w-16 h-16 mb-3 bg-white rounded-full cursor-pointer" onClick={handleCreateChatRoomButtonClick}>
                    <ArrowRightCircleIcon className="w-10 h-10 text-gray-500" />
                </div>
            </div>
        </>
    );
}

export default CreateChatRoomButton;
