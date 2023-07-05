import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';

import type { Profile } from 'passport-github';

const app = express();

const server = http.createServer(app);

interface StarShape {
    id: string;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
}

declare module 'express-session' {
    interface SessionData {
        passport: {
            user: Profile;            
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        session: {
            passport: {
                user: Profile;
            }
        }
    }
}

function generateStarShapes(maxStars: number, maxWidth: number, maxHeight: number): StarShape[] {
    let starShapes: StarShape[] = [];
    for (let i = 0; i < maxStars; i++) {
        starShapes.push({
            id: i.toString(),
            x: Math.random() * maxWidth,
            y: Math.random() * maxHeight,
            rotation: Math.random() * 180,
            isDragging: false
        });
    }
    return starShapes;
}

interface StarShapeInstances {
    [key: string]: StarShape[];
}

let starShapeInstances: StarShapeInstances = {};

interface ServerToClientEvents {
    helloReply: () => void;
    roomCreatedReply: (data: {roomCode: string}) => void;
    joinRoomReply: (data: {success: boolean}) => void;
    message: (data: {message: string}) => void;
    setStarShapes: (data: {starShapes: StarShape[]}) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    createNewRoom: () => void;
    joinRoom: (data: {roomCode: string}) => void;
    sendMessage: (data: {message: string, room: string}) => void;
    setStarShapes: (data: {roomCode: string, starShapes: StarShape[]}) => void;
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

let redisClient = createClient({
    url: 'redis://redis:6379',
});
redisClient.connect().catch(console.error);

let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
})

io.engine.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: redisStore,
}))

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('hello', () => {
        console.log('Received hello event');
        const { data } = socket;                
        console.log('data', data);
        console.log('passport user', socket.request.session.passport.user);
        // Handle the hello event here
        socket.emit('helloReply');
    });

    socket.on('createNewRoom', () => {
        console.log('Received createNewRoom event');
        // Handle the createNewRoom event here
        const roomCode: string = "1234";
        starShapeInstances[roomCode] = generateStarShapes(5, 340, 512);
        socket.join(roomCode);
        socket.emit('roomCreatedReply', {roomCode: '1234'});
    });

    socket.on('joinRoom', (data) => {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        socket.join(data.roomCode);
        socket.emit('joinRoomReply', {success: true});
        io.to(data.roomCode).emit('setStarShapes', {starShapes: starShapeInstances[data.roomCode]});
    });

    socket.on('sendMessage', (data) => {
        console.log('Received sendMessage event', data);
        // Handle the sendMessage event here
        io.to(data.room).emit('message', {message: data.message});
    });

    socket.on('setStarShapes', (data) => {
        console.log('Received setStarShapes event', data);
        // Handle the setStarShapes event here
        starShapeInstances[data.roomCode] = data.starShapes;
        io.to(data.roomCode).emit('setStarShapes', {starShapes: data.starShapes});
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