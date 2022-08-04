import axios from 'axios';
import {NextPage} from 'next';
import React, {useEffect, useMemo, useState} from 'react';
import Image from 'next/image';
import {IUser, Video} from '../../types';
import {GoVerified} from 'react-icons/go';
import VideoCard from '../../components/VideoCard';
import NoResults from '../NoResults';
import { useRouter } from 'next/router';

interface IProps {
    data: {
        user: IUser;
        videos: Video[];
        likes: Video[];
    };
}

type videoTagList = JSX.Element | JSX.Element[] | null;

const ProfileTag: NextPage<IProps> = ({data}) => {
    const [videoList, setVideoList] = useState<videoTagList>(null);
    const {user, videos, likes} = data;
    const [selectedVideos, setSelectedVideos] = useState(true);

    const router = useRouter();
    

    const checkIsActive = (flag: boolean) =>
        flag ? 'border-b-2 border-black' : 'text-gray-400';
    const [videoStyle, likedVideoStyle] = [
        checkIsActive(selectedVideos),
        checkIsActive(!selectedVideos),
    ];

    useEffect(() => {
        const makeElement = () => {
            const currentVideos = selectedVideos ? videos : likes;

            if (!currentVideos?.length) {
                if (selectedVideos)
                    return (
                        <NoResults
                            className='font-semibold text-base text-center'
                            text="How is it possible, you so long with us and haven't published anything yet 🥲"
                        />
                    );
                return (
                    <NoResults
                        className='font-semibold text-base text-center'
                        text='Keep on looking for what you like 👍'
                    />
                );
            }

            return currentVideos.map((post) => (
                <VideoCard post={post} key={post._id} bottomLine={false}/>
            ));
        };
        setVideoList(makeElement());

    }, [selectedVideos, user, likes, videos]);

    if(!user?.image || !user?.userName || !user?._id) {router.push('/'); return null}
    return (
        <div className='w-full'>
            <div className='flex gap-6 md:gap-10 nb-4 bg-white'>
                <div className='w-16 h-16 md:w-32 md:h-32'>
                    <Image
                        src={user.image}
                        width={100}
                        height={100}
                        className='rounded-full'
                        alt='user profile'
                        layout='responsive'
                    />
                </div>
                <div className='flex flex-col justify-center'>
                    <p className='md:text-2xl justify-center tracking-wider flex gap-1 items-center text-base font-bold text-primary lowercase'>
                        {user.userName.replaceAll(' ', '')}
                        <GoVerified className='text-blue-400' />
                    </p>
                    <p className='capitalize md:text-xl text-gray-400 text-xs'>
                        {user.userName}
                    </p>
                </div>
            </div>
            <div className='md:pt-10'>
                <div className='flex gap-10 my-10 border-b-2 border-gray-200 bg-white w-full'>
                    <p
                        className={`text-center text-xl pb-2 -mb-[2px] font-semibold cursor-pointer ${videoStyle}`}
                        onClick={() => setSelectedVideos(true)}
                    >
                        Videos
                    </p>
                    <p
                        className={`text-center text-xl pb-2 -mb-[2px] font-semibold cursor-pointer ${likedVideoStyle}`}
                        onClick={() => setSelectedVideos(false)}
                    >
                        Likes
                    </p>
                </div>
                <div className='flex gap-6 flex-wrap md:justify-start'>
                    {videoList}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps = async (args: any) => {
    const id = args?.params?.id;
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/profile/${id}`
    );

    return {
        props: {
            data: response?.data ? response.data : null,
        },
    };
};

export default ProfileTag;
