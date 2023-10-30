"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fooHandlerOne = void 0;
const fooHandlerOne = (io, socket) => {
    console.log("fooHandlerOne emitting...");
    const { data } = socket;
    console.log('data', data);
    console.log('passport user', socket.request.session.passport.user);
    socket.emit("fooHandlerOneReply");
};
exports.fooHandlerOne = fooHandlerOne;
