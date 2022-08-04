import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {MdFavorite} from 'react-icons/md';
import useAuthStore from '../store/authStore';
import {NextPage} from 'next';
import {IExtendedVideo} from '../types';
import { useRouter } from 'next/router';

interface IProps {
    post: IExtendedVideo;
}

const LikeButton: NextPage<IProps> = ({post}) => {
    const {userProfile, setLikeCallback, setLikeRoute} = useAuthStore();
    const router = useRouter();

    useEffect(()=>{setLikeRoute(router.asPath)},[])

    const searchIfThereLiked = () => {
        return post.likes?.some((item) => item._ref === userProfile?._id);
    };

    const [isLiked, setIsLiked] = useState(true);
    const [isReadyToMakeRequest, setIsReadyToMakeRequest] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const putRequestIsLiked = async () => {
        const callback = async () => {
            console.log({isLiked});
            await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/like`,
                {userId: userProfile?._id, postId: post._id, like: isLiked}
            );
        }

        if(isLiked === searchIfThereLiked()){
            setLikeCallback({isValid: false, callback});
            return;
        }

        setLikeCallback ({isValid: true, callback})
    };

    useEffect(() => {
        if (!isReadyToMakeRequest) {
            setIsLiked(searchIfThereLiked());
            setIsReadyToMakeRequest(true);
        }
    }, [searchIfThereLiked, isReadyToMakeRequest, searchIfThereLiked]);

    useEffect(() => {
        if (isReadyToMakeRequest) {
            putRequestIsLiked();
        }
    }, [isLiked]);

    if (!userProfile) return null;
    return (
        <div className='gap-6'>
            <div
                className='mt-2 ml-8 flex flex-col justify-start items-center w-12
    '
            >
                <div
                    className={`bg-primary rounded-full p-3 text-${
                        isLiked ? '[#F51997]' : 'black'
                    } cursor-pointer`}
                    onClick={handleLike}
                >
                    <MdFavorite className='text-2xl' />
                </div>
                <p className='text-base font-semibold'>
                    {post.likes?.length ? post.likes.length : 0}
                </p>
            </div>
        </div>
    );
};

export default LikeButton;
