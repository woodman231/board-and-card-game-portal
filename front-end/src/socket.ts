import { io } from 'socket.io-client';

export const socket = io({autoConnect: false});
export const namedSocket = io("/speedgame", {autoConnect: false});