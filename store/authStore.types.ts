export interface IUser {
    _id: string;
    _type: string;
    userName: string;
    image: string;
}

interface LikeCallback {
    callback: () => Promise<void>;
    isValid: boolean;
}

export interface IAuthStore<T> {
    userProfile: T | null;
    allUsers: T[] | null;
    likeCallback: LikeCallback;
    likeRoute: string | null;
    setLikeRoute: (route: string) => void;
    setLikeCallback: (properties: LikeCallback) => void;
    addUser: (user: T) => void;
    removeUser: () => void;
    fetchAllUsers: () => Promise<void>;
}
