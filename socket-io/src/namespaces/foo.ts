import { Socket, Server } from 'socket.io';
import { fooHandlerOne } from './fooHandlers/fooHandlerOne';

const registerHandlers = (io: Server, socket: Socket) => {
    socket.on("test", (data: {message: string}) => fooHandlerOne(io, socket));
};

const registerNameSpace = (io: Server) => {
    const foo = io.of("/foo");
    foo.on("connection", (socket) => {
        registerHandlers(io, socket);
    });
};

export default registerNameSpace;