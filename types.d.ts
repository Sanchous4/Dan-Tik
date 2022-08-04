export interface Video {
    caption: string;
    video: {
        asset: {
            _id: string;
            url: string;
        };
    };
    _id: string;
    postedBy: {
        _id: string;
        userName: string;
        image: string;
    };
    likes: {
        postedBy: {
            _id: string;
            userName: string;
            image: string;
        };
    }[];
    comments: {
        comment: string;
        _key: string;
        postedBy: {
            _ref: string;
            _id: ?string;
        };
    }[];
    userId: string;
}

export interface IComment {
    comment: string;
    length?: number;
    _key: string;
    postedBy: {
        _ref: string;
        _id: ?string;
    };
}

export interface ICommentForDisplaying {
    key: string;
    comment: string;
    user: {
        image: string;
        name: string;
        id: string;
    };
}

export interface IUser {
    _id: string;
    _type: string;
    userName: string;
    image: string;
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IExtendedVideo extends Omit<Video, 'likes'> {
    likes: {
        _key: string;
        _ref: string;
    }[];
}

export type inputAndFormEvent =
    | React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement, MouseEvent>;
