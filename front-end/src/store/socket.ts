import { createSlice } from "@reduxjs/toolkit";
import type { Socket } from 'socket.io-client';

export interface SocketState {
    socket: Socket | null;
}

const initialState: SocketState = {
    socket: null
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
    },
});

export const { setSocket } = socketSlice.actions;

export default socketSlice.reducer;

export const selectSocket = (state: { socket: SocketState }) => state.socket.socket;
