import create from 'zustand';
import {persist} from 'zustand/middleware';
import axios from 'axios';
import {IAuthStore} from './authStore.types';
import {IUser} from '../types';

const authStore: (set: any) => IAuthStore<IUser> = (set: any) => ({
    userProfile: null,
    allUsers: null,
    likeCallback: {isValid: false, callback: async () => {}},
    likeRoute: null,
    setLikeRoute: (route) => {
        set({likeRoute: route});
    },
    setLikeCallback: (properties) => {
        console.log({properties});
        if (!properties.isValid) {
            set({likeCallback: {isValid: false, callback: async () => {}}});
        } else {
            set({likeCallback: properties});
        }
    },
    addUser: (user: any) => set({userProfile: user}),
    removeUser: () => set({userProfile: null}),
    fetchAllUsers: async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`
        );
        set({allUsers: response.data});
    },
});

const useAuthStore = create(persist(authStore, {name: 'auth'}));

export default useAuthStore;
