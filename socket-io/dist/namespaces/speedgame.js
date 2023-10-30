"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createGameHandler_1 = require("./speedgameHandlers/createGameHandler");
const registerHandlers = (io, socket) => {
    socket.on("createNewRoom", () => (0, createGameHandler_1.createGameHandler)(io, socket));
};
const registerNameSpace = (io) => {
    const speedgame = io.of("/speedgame");
    speedgame.on("connection", (socket) => {
        registerHandlers(io, socket);
    });
};
exports.default = registerNameSpace;
