import { Server, Socket } from "socket.io";

export const fooHandlerOne = (io: Server, socket: Socket) => {
    console.log("fooHandlerOne emitting...");
    const { data } = socket;
    console.log('data', data);
    console.log('passport user', socket.request.session.passport.user);
    socket.emit("fooHandlerOneReply");
};