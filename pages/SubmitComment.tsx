import React, {Dispatch, LegacyRef, SetStateAction, useEffect, useRef, useState} from 'react';
import {NextPage} from 'next';
import useAuthStore from '../store/authStore';
import axios from 'axios';
import {IComment, IExtendedVideo, inputAndFormEvent} from '../types';

interface IProps {
    height: string;
    post: IExtendedVideo;
    setPost: Dispatch<SetStateAction<IExtendedVideo>>;
}

interface responsePutComment {
    comments: IComment[];
}

const prepareCommentForSubmitting = (text: string) => {
    return text.replace(/\s\s+/g, ' ').trim();
};

const SubmitComment: NextPage<IProps> = ({height, post, setPost}) => {
    const {userProfile} = useAuthStore();
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    const addComment = async (event: inputAndFormEvent) => {
        event?.preventDefault();
        const comment = prepareCommentForSubmitting(newComment);
        if (!userProfile || comment.length < 2) return;

        setIsCommenting(true);
        const {data}: {data: responsePutComment} = await axios.put(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/post/${post._id}`,
            {
                userId: userProfile._id,
                comment: comment,
            }
        );

        if (data) {
            setPost({...post, comments: data.comments});
            setNewComment('');
        }
        setIsCommenting(false);
    };
    return (
        <div className='relative w-full bg-white min-h-[50px]' style={{height}}>
            <div
                className={`absolute bottom-5 z-40  w-full  outline-none ${
                    !userProfile && 'hidden'
                }`}
            >
                <div className='w-full flex justify-center '>
                    <div className='bg-white rounded-lg flex w-[70%] lg:w-[85%] justify-between p-2 '>
                        <form onSubmit={addComment} className='w-full flex '>
                            <input
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className='outline-none border-gray-400 border-2 w-full text-base p-2 pl-6 h-[8vh] min-h-[50px] rounded-lg  font-semibold bg-[#f0ecec]'
                                type='text'
                                placeholder='Add comment...'
                            />
                            <button className='text-gray-400 ml-6 px-1 cursor-pointer'
                            onClick={addComment}>
                            {isCommenting ? 'Adding\u00A0...' : 'Comment'}
                            
                             </button>
                            
                        </form>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmitComment;
