import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);

interface ServerToClientEvents {
    helloReply: () => void;
    roomCreatedReply: (data: {roomCode: string}) => void;
    joinRoomReply: (data: {success: boolean}) => void;
    message: (data: {message: string}) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    createNewRoom: () => void;
    joinRoom: (data: {roomCode: string}) => void;
    sendMessage: (data: {message: string, room: string}) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);

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
        socket.emit('roomCreatedReply', {roomCode: '1234'});
    });

    socket.on('joinRoom', (data) => {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        socket.join(data.roomCode);
        socket.emit('joinRoomReply', {success: true});
    });

    socket.on('sendMessage', (data) => {
        console.log('Received sendMessage event', data);
        // Handle the sendMessage event here
        io.to(data.room).emit('message', {message: data.message});
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