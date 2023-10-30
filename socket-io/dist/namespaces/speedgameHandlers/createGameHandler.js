"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameHandler = void 0;
const generateRoomCode_1 = require("../../utils/generateRoomCode");
const initializeTable_1 = require("../../speedgame/initializeTable");
const createGameHandler = (io, socket) => {
    console.log("createGameHandler recieved...");
    const roomCode = (0, generateRoomCode_1.generateRoomCode)();
    const table = (0, initializeTable_1.initializeTable)({
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
};
exports.createGameHandler = createGameHandler;
