import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {IExtendedVideo} from '../types';
import {NextPage} from 'next';
import {GoVerified} from 'react-icons/go';
import LikeButton from './LikeButton';
import useAuthStore from '../store/authStore';

interface IProps {
    height: string;
    post: IExtendedVideo;
}

const PostProfileDetail: NextPage<IProps> = ({height, post}) => {
    const {userProfile} = useAuthStore();
    return (
        <div className=' bg-white min-h-[225px]' style={{height}}>
            <Link href={`/profile/${post.postedBy._id}`}>
            <div className='flex pt-6 gap-3 p-2 cursor-pointer font-semibold rounded'>
                <div className='w-16 h-16 ml-4'>
                    
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
                        <div className='mt-2 flex flex-col gap-1'>
                            <p className='flex gap-2 text-xl items-center font-bold text-primary'>
                                {post.postedBy.userName}
                                <GoVerified className='text-blue-400 text-base' />
                            </p>
                            <p className='capitalize font-medium text-xs text-black hidden md:block'>
                                {post.postedBy.userName}
                            </p>
                        </div>
                </div>
            </div>
            </Link>
            <div className=''>
                <p className='pl-5 text-base text-gray-600 text-ellipsis'>{post.caption}</p>
            </div>
            {userProfile && (
                <div className='pt-3'>
                    <LikeButton post={post} />
                </div>
            )}
        </div>
    );
};

export default PostProfileDetail;
