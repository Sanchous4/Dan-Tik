import React, {useMemo, useRef, useState} from 'react';
import {NextPage} from 'next';
import {Video} from '../types';
import {HiVolumeUp, HiVolumeOff} from 'react-icons/hi';
import {BsFillPlayFill, BsFillPauseFill} from 'react-icons/bs';
import {GoVerified} from 'react-icons/go';
import Link from 'next/link';
import Image from 'next/image';

interface IProps {
    post: Video;
    bottomLine?: boolean;
}

const VideoCard: NextPage<IProps> = ({post, bottomLine}) => {
    

    const checkIsMobile = (size: number) => window.innerWidth <= size;
    const isMobile = checkIsMobile(768);

    const [isHover, setIsHover] = useState(false);
    const [playing, setPlaying] = useState(true);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    // const videoRef : React.LegacyRef<HTMLVideoElement> = useRef(null)
    const videoRef = useRef<HTMLVideoElement>(null);

    const controlsOpacity = useMemo(() => {
        if (!playing && isMobile) return 'opacity-25';
        return 'opacity-50';
    }, [playing, isMobile]);

    const onVideoPress = () => {
        playing ? videoRef?.current?.play() : videoRef?.current?.pause();
        setPlaying(!playing);
    };

    const onMutePress = () => {
        setIsVideoMuted(!isVideoMuted);
    };

    if (!post?.video?.asset?.url) return null;
    return (
        <div
            className={`flex flex-col ${
                bottomLine ? 'border-b-2' : ''
            } border-gray-200 pb-6`}
        >
            <div>
                <Link href={`/profile/${post.postedBy._id}`}>
                    <div className='flex gap-3 p-2 cursor-pointer font-semibold rounded'>
                        <div className='md:w-16 md:h-16 w-10 h-10'>
                            <Image
                                width={62}
                                height={62}
                                className='rounded-full'
                                src={post.postedBy.image}
                                alt='profile photo'
                                layout='responsive'
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <p className='flex gap-2 items-center md:text-base font-bold text-primary'>
                                    {post.postedBy.userName}
                                    {`
                                    `}
                                    <GoVerified className='text-blue-400 text-base' />
                                </p>
                                <p className='capitalize font-medium text-xs text-gray-500 hidden md:block'>
                                    {post.postedBy.userName}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className='lg:ml-20 flex gap-4 relative '>
                <div
                    className='rounded-3xl relative'
                    onMouseEnter={() => {
                        setIsHover(true);
                    }}
                    onMouseLeave={() => {
                        setIsHover(false);
                    }}
                >
                    <Link href={`/detail/${post._id}`}>
                        <video
                            src={post.video.asset.url}
                            loop
                            className='lg:w-[600px] lg:h-[530px] md:h-[400px] h-[300px] w-[200px] rounded-2xl cursor-pointer bg-gray-100'
                            ref={videoRef}
                            muted={isVideoMuted}
                        />
                    </Link>
                    {/* absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0 flex gap-10 justify-between lg:justify-between w-full md:w-[50px] p-3 */}
                    {(isHover || isMobile) && (
                        <div className='absolute bottom-6 cursor-pointer lg:left-0 flex gap-10 justify-between w-full p-4'>
                            {playing ? (
                                <button onClick={onVideoPress}>
                                    <BsFillPlayFill
                                        className={`text-white lg:text-black text-2xl ${controlsOpacity} lg:text-4xl`}
                                    />
                                </button>
                            ) : (
                                <button onClick={onVideoPress}>
                                    <BsFillPauseFill
                                        className={`text-white lg:text-black text-2xl ${controlsOpacity} lg:text-4xl`}
                                    />
                                </button>
                            )}
                            {isVideoMuted ? (
                                <button onClick={onMutePress}>
                                    <HiVolumeOff
                                        className={`text-white lg:text-black text-2xl ${controlsOpacity} lg:text-4xl`}
                                    />
                                </button>
                            ) : (
                                <button onClick={onMutePress}>
                                    <HiVolumeUp
                                        className={`text-white lg:text-black text-2xl ${controlsOpacity} lg:text-4xl`}
                                    />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
