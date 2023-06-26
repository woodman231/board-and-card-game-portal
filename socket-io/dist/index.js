"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('hello', () => {
        console.log('Received hello event');
        // Handle the hello event here
        socket.emit('helloReply');
    });
    socket.on('createNewRoom', () => {
        console.log('Received createNewRoom event');
        // Handle the createNewRoom event here
        socket.emit('roomCreatedReply', { roomCode: '1234' });
    });
    socket.on('joinRoom', (data) => {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        socket.join(data.roomCode);
        socket.emit('joinRoomReply', { success: true });
    });
    socket.on('sendMessage', (data) => {
        console.log('Received sendMessage event', data);
        // Handle the sendMessage event here
        io.to(data.room).emit('message', { message: data.message });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
