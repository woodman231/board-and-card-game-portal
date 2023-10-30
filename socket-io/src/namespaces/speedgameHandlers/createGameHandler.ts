import { Server, Socket } from "socket.io";
import { generateRoomCode } from "../../utils/generateRoomCode";
import { initializeTable } from "../../speedgame/initializeTable";

export const createGameHandler = (io: Server, socket: Socket) => {
    console.log("createGameHandler recieved...");
    const roomCode = generateRoomCode();
    const table = initializeTable({
        id: roomCode,
        name: roomCode,
        playerOne: {
            id: socket.request.session.passport.user.id,
            name: socket.request.session.passport.user.displayName,
        },
        playerTwo: {
            id: "",
            name: "",
        }
    });    

    console.log("table", JSON.stringify(table));

    socket.emit("roomCreatedReply", { table });
}
