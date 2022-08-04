import React, {useEffect, useMemo} from 'react';
import {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {GoVerified} from 'react-icons/go';
import useAuthStore from '../store/authStore';
import NoResults from './NoResults';
import {IComment, ICommentForDisplaying, IExtendedVideo} from '../types';
import lodash from 'lodash';
import checkAvatar from '../utils/tools/avatarChecker'

interface IProps {
    height: string;
    post: IExtendedVideo;
}

const Comments: NextPage<IProps> = ({height, post}) => {
    const {allUsers} = useAuthStore();

    // useEffect(() => {}, [allUsers])

    const comments = useMemo(() => {
        if (!allUsers || !post.comments) return [];

        const newComments: ICommentForDisplaying[] = new Array(
            post.comments.length
        ).fill({
            key: '',
            comment: '',
            user: {
                name: '',
                image: '',
                id: '',
            },
        });
        

        for (let userIndex = 0; userIndex < allUsers.length; userIndex++) {
            const userItem = allUsers[userIndex];
            // console.log({userIndex, userItem})
            for (
                let postIndex = 0;
                postIndex < post.comments.length;
                postIndex++
            ) {
                const postItem = post.comments[postIndex];
                // console.log({postIndex, postItem})
                if (postItem.postedBy._id === userItem._id || postItem.postedBy._ref === userItem._id )
                    newComments[postIndex] = {
                        key: postItem._key,
                        comment: postItem.comment,
                        user: {
                            name: userItem.userName,
                            image: userItem.image,
                            id: userItem._id,
                        },
                    };
            }
        }
        // console.log({comments_post: post.comments})
        // console.log({allUsers})
        // console.log({newComments})

        return newComments;
    }, [post.comments, allUsers]);

    // console.log({post})
    // console.log(comments)

    const noCommentsComponent = (
        <NoResults className='text-2xl text-center' text='Be the first commentator 😉' />
    );

    const commentsExistComponent = (
        <div className=''>
            {comments?.map((item) => {
                //  console.log(`/profile/${item.user.id}`);
                 return <div key={item.key} className='p-2 items-center bg-gray-200 mt-2 rounded cursor-pointer'>
                    <Link href={`/profile/${item.user.id}`}>
                        <div className='flex items-center xl:items-start gap-3 '>
                            <div className='w-10 h-10'>
                                <Image
                                    src={checkAvatar(item?.user?.image)}
                                    width={40}
                                    height={40}
                                    className='rounded-full'
                                    alt='user profile'
                                    layout='fixed'
                                />
                            </div>
                            <div className='hidden xl:block'>
                                <p className='flex gap-1 items-center text-base font-bold text-primary lowercase'>
                                    {item.user.name.replaceAll(' ', '')}
                                    <GoVerified className='text-blue-400' />
                                </p>
                                <p className='capitalize text-gray-400 text-xs'>
                                    {item.user.name}
                                </p>
                            </div>
                            <div className='block  xl:hidden break-all'>
                                <p>{item.comment}</p>
                            </div>
                        </div>
                    </Link>
                    <div className='hidden xl:block mt-3 ml-4 break-all'>
                        <p>{item.comment}</p>
                    </div>
                </div>
})}
            <div className="h-[10vh] w-full"></div>
        </div>
    );

    return (
        <div
            className=' bg-[#f6f6f6] border-t-2 border-gray-200 pt-4 px-6 overflow-scroll overflow-x-hidden'
            style={{height}}
        >
            {comments?.length ? commentsExistComponent : noCommentsComponent}
        </div>
    );
};

export default Comments;
