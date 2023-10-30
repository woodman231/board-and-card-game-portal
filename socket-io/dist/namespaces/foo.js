"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fooHandlerOne_1 = require("./fooHandlers/fooHandlerOne");
const registerHandlers = (io, socket) => {
    socket.on("test", (data) => (0, fooHandlerOne_1.fooHandlerOne)(io, socket));
};
const registerNameSpace = (io) => {
    const foo = io.of("/foo");
    foo.on("connection", (socket) => {
        registerHandlers(io, socket);
    });
};
exports.default = registerNameSpace;
