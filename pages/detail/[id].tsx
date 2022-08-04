import React, {useMemo, useRef, useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {GoVerified} from 'react-icons/go';
import {MdOutlineCancel} from 'react-icons/md';
import {BsFillPlayFill, BsFillPauseFill} from 'react-icons/bs';
import {BsVolumeMuteFill, BsVolumeUpFill} from 'react-icons/bs';
import axios from 'axios';
import {NextPage} from 'next';
import {IExtendedVideo} from '../../types';
import useAuthStore from '../../store/authStore';
import Comments from '../Comments';
import LikeButton from '../LikeButton';
import SubmitComment from '../SubmitComment';
import PostProfileDetail from '../PostProfileDetail';

interface IProps {
    postDetails: IExtendedVideo;
}

const Detail: NextPage<IProps> = ({postDetails}) => {
    const router = useRouter();

    const [post, setPost] = useState(postDetails);
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlay, setShowPlay] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // const {userProfile} = useAuthStore();
    const checkIsMobile = (size: number) => window.innerWidth <= size;
    const isMobile = checkIsMobile(768);
    const controlsOpacity = useMemo(() => {
        if (!isPlaying && isMobile) return 'opacity-10';
        return 'opacity-40';
    }, [isPlaying, isMobile]);

    const handlePause = (event: any) => {
        isPlaying ? videoRef?.current?.play() : videoRef?.current?.pause();
        setIsPlaying(!isPlaying);
    };

    // console.log({post});

    const videoRef = useRef<HTMLVideoElement>(null);
    if (!post) {
        router.push('/');
        return null;
    }
    return (
        <div className='bg-blurred-img bg-no-repeat bg-cover bg-center h-full w-full fixed top-0 left-0 z-1 overflow-y-auto overflow-x-hidden '>
            <div className='lg:flex w-full h-full'>
                <div className='w-full lg:fixed  lg:w-4/6 h-[100vh] flex justify-center'>
                    <div className='absolute top-4 left-4 flex gap-6 z-50 cursor-pointer'>
                        <p>
                            <Link href='/'>
                                <span>
                                    <MdOutlineCancel className='text-white text-[35px] ' />
                                </span>
                            </Link>
                        </p>
                    </div>
                    <div className='flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center h-[100vh] w-full'>
                        <div className='relative h-[70vh] w-full'>
                            <div
                                onMouseEnter={() => setShowPlay(true)}
                                onMouseLeave={() => setShowPlay(false)}
                            >
                                <video
                                    ref={videoRef}
                                    loop
                                    onClick={() => {}}
                                    src={post.video.asset.url}
                                    className='h-full rounded-lg -translate-y-1/2 -translate-x-1/2 absolute top-[50%] left-[50%]'
                                    muted={isMuted}
                                ></video>
                                <div
                                    className={`-translate-y-1/2 -translate-x-1/2 absolute top-[50%] left-[50%] ${
                                        showPlay || 'hidden'
                                    }`}
                                >
                                    {isPlaying ? (
                                        <button onClick={handlePause}>
                                            <BsFillPlayFill
                                                className={`text-white text-6xl lg:text-8xl ${controlsOpacity}`}
                                            />
                                        </button>
                                    ) : (
                                        <button onClick={handlePause}>
                                            <BsFillPauseFill
                                                className={`text-white text-6xl lg:text-8xl ${controlsOpacity}`}
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='absolute lg:fixed  bottom-8 lg:w-4/6 w-full'>
                        <div className=' flex justify-end mr-4'>
                            <p>
                                {isMuted ? (
                                    <BsVolumeMuteFill
                                        className='text-white text-[35px]'
                                        onClick={(event) =>
                                            setIsMuted(!isMuted)
                                        }
                                    />
                                ) : (
                                    <BsVolumeUpFill
                                        className='text-white text-[35px]'
                                        onClick={(event) =>
                                            setIsMuted(!isMuted)
                                        }
                                    />
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='lg:w-2/6 lg:absolute lg:right-0 w-[100vw] h-[100vh]'>
                    <PostProfileDetail height='30vh' post={post} />
                    <Comments post={post} height='62.5vh' />
                    <SubmitComment
                        setPost={setPost}
                        post={post}
                        height='7.5vh'
                    />
                </div>
            </div>
        </div>
        // <p>Hey</p>
    );
};

export const getServerSideProps = async (params: any) => {
    try {
        const {data} = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${params.query.id}`
        );
        return {
            props: {
                postDetails: data,
            },
        };
    } catch (err) {}

    return {
        props: {
            postDetails: null,
        },
    };
};

export default Detail;
