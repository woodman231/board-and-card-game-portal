import { Socket, Server } from 'socket.io';
import { createGameHandler } from './speedgameHandlers/createGameHandler';

const registerHandlers = (io: Server, socket: Socket) => {
    socket.on("createNewRoom", () => createGameHandler(io, socket));
}

const registerNameSpace = (io: Server) => {
    const speedgame = io.of("/speedgame");
    speedgame.on("connection", (socket) => {
        registerHandlers(io, socket);
    });
}

export default registerNameSpace;