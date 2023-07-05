import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { api } from './api';
import authReducer from "../features/auth/reducers/authReducer";
import socketReducer from './socket';
import chatReducer from '../features/chatroom/reducers/chatReducer';

export const createStore = (options?: ConfigureStoreOptions['preloadedState']) => {
    return configureStore({
        reducer: {
            [api.reducerPath]: api.reducer,
            auth: authReducer,
            socket: socketReducer,
            chat: chatReducer
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
        ...options
    })
}

export const store = createStore();

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export type RootState = ReturnType<typeof store.getState>
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector