import React, {useMemo, useState} from 'react';
import {FaCloudUploadAlt} from 'react-icons/fa';
import {MdDelete} from 'react-icons/md';
import axios from 'axios';
import {SanityAssetDocument} from '@sanity/client';
import useAuthStore from '../store/authStore';
import {client} from '../utils/client';
import {topics} from '../utils/constants';
import { useRouter } from 'next/router';

const Upload = () => {
    const router = useRouter();
    const {userProfile} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | null>(
        null
    );
    const [wrongFile, setWrongFile] = useState(false);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState(topics[0].name);
    const [savingPost, setSavingPost] = useState(false);

    // const {} = useAuthStore();
    const frameTextStyle = 'border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'
    const frameVideoStyle = 'border-dashed rounded-xl border-4 border-gray-200 outline-none mt-10 w-full md:w-[400px] h-[460px] p-[4px] cursor-pointer hover:border-red-300 hover:bg-gray-100'
    const frameSavingPostStyle = 'border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[400px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'

    const currentFrameStyle = useMemo(()=>{
        if(videoAsset)
        return frameVideoStyle
        if(savingPost)
        return frameSavingPostStyle
        return frameTextStyle
    },[videoAsset, savingPost])


    const handleDiscard = () => setVideoAsset(null);

    const handlePost = async () => {
        if(caption && videoAsset?._id && category && userProfile?._id) {
            setSavingPost(true);
            const document = {
                _type: 'post',
                caption,
                video : {
                    _type: 'file',
                    asset : {
                        _type: 'reference',
                        _ref: videoAsset?._id
                    }
                },
                userId: userProfile._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref : userProfile?._id
                },
                topic: category
            }

            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post`, document);
            setSavingPost(false);
            router.push('/');
        }
    }

    const uploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let selectedFile: File | null = null;
        if (e.target.files) selectedFile = e.target.files[0];
        if (!selectedFile) return;

        const selectedFileType = selectedFile.type.replace('video/', '');
        const fileTypes = ['mp4', 'webm', 'ogg'];

        const isWrongType = !fileTypes.includes(selectedFileType);

        setIsLoading(!isWrongType);
        setWrongFile(isWrongType);

        if (!isWrongType) {
            setIsLoading(true);
            const data = await client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name,
            });
            setVideoAsset(data);
            setIsLoading(false);
        }
    };

    return (
        <div className='flex xl:w-[1200px] w-full h-full justify-center'>
            <div className='bg-white shadow-lg rounded-2xl h-[98%] flex gap-6 flex-wrap justify-between items-center p-14 pt-6 w-[90%] md:w-[80%] overflow-auto'>
                <div>
                    <div className="">
                        <p className='text-2xl font-bold'>Upload Video</p>
                        <p className='text-base text-gray-400 mt-1'>
                            Post a video to your account
                        </p>
                    </div>
                    <div className={currentFrameStyle}>
                        {(isLoading || savingPost) ? (
                            <p>Uploading...</p>
                        ) : (
                            <div className="w-full h-full">
                                {videoAsset ? (
                                    <div className="flex justify-center w-full h-full ">
                                        <video
                                            src={videoAsset.url}
                                            loop
                                            controls
                                            className='h-[440px] bg-white rounded-xl'
                                        ></video>
                                    </div>
                                ) : (
                                    <label className='cursor-pointer'>
                                        <div className='flex flex-col items-center justify-center h-full'>
                                            <div className='flex flex-col items-center justify-center '>
                                                {' '}
                                                <p className='font-bold text-xl'>
                                                    <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                                                </p>
                                                <p className='text-xl font-semibold'>
                                                    Upload a video
                                                </p>
                                            </div>
                                            <p className='text-gray-400 text-center mt-10 text-small leading-8'>
                                                MP4 or WebM or Ogg
                                                <br />
                                                720x1280 or higher
                                                <br />
                                                Up to 10 minutes
                                                <br />
                                                Less than 2GB
                                            </p>
                                            <p className='bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                                                Select a file
                                            </p>
                                            <input
                                                type='file'
                                                name='upload-video'
                                                onChange={uploadVideo}
                                                className='w-0 h-0'
                                            />
                                        </div>
                                    </label>
                                )}
                            </div>
                        )}
                        {wrongFile && (
                            <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                                Type is incorrect
                            </p>
                        )}
                    </div>
                </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-base font-medium'>Caption</label>
                    <input
                        className='rounded outline-none text-base border-2 border-gray-200 p-2'
                        type='text'
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                    <label className='text-base font-medium'>
                        Pick a category
                    </label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
                        defaultValue="default"
                        className='outline-none border-2 border-gray-200 text-base capitalize lg:p-4 p-2 rounded cursor-pointer'
                        
                    >
                        <option value="default" disabled hidden>Choose here</option>
                        {topics.map((topic) => (
                            <option
                                className='outline-none capitalize bg-white text-gray-700 text-base p-2 hover:bg-slate-300'
                                key={topic.name}
                                value={topic.name}
                            >
                                {topic.name}
                            </option>
                        ))}
                    </select>
                    <div className='flex gap-6 mt-10'>
                        <button
                            onClick={handleDiscard}
                            type='button'
                            className='border-gray-300 border-2 text-base font-medium p-2 rounded w-28 lg:w-44 outline-none'
                        >
                            Discard
                        </button>
                        <button
                            onClick={handlePost}
                            type='button'
                            className=' text-base font-medium p-2 rounded w-28 lg:w-44 outline-none bg-[#F51997] text-white'
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
