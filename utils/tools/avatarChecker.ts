import AvatarPlug from '../no-avatar.png';

const checkAvatar = (img: any) => {
    return img || AvatarPlug;
};

export default checkAvatar;
