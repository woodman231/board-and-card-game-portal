import { createSlice } from "@reduxjs/toolkit";

export interface StarShape {
    id: string;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
}

export interface ChatState {
    chatRoomCode: string;
    messages: string[];
    stars: StarShape[];
}

const initialState: ChatState = {
    chatRoomCode: '',
    messages: [],
    stars: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatRoomCode: (state, action) => {
            state.chatRoomCode = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
        },
        setStars: (state, action) => {
            state.stars = action.payload;
        }
    },
});

export const { setChatRoomCode, addMessage, clearMessages, setStars } = chatSlice.actions;

export default chatSlice.reducer;

export const selectChatRoomCode = (state: { chat: ChatState }) => state.chat.chatRoomCode;
export const selectMessages = (state: { chat: ChatState }) => state.chat.messages;
