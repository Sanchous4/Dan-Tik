import axios from 'axios';
import {NextPage} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useEffect, useMemo, useState} from 'react';
import { GoVerified } from 'react-icons/go';
import VideoCard from '../../components/VideoCard';
import useAuthStore from '../../store/authStore';
import {Video} from '../../types';
import NoResults from '../NoResults';

interface IProps {
    videos: Video[];
}

const SearchResults: NextPage<IProps> = ({videos}) => {
    const {allUsers} = useAuthStore();
    const router = useRouter();

    const searchTerm = Array.isArray(router?.query)
        ? `${router?.query[0]?.searchTerm}`
        : `${router?.query.searchTerm}`;

    const [selectedAccounts, setSelectedAccounts] = useState(true);

    const checkIsActive = (flag: boolean) =>
        flag ? 'border-b-2 border-black' : 'text-gray-400';
    const [accountStyle, videosStyle] = [
        checkIsActive(selectedAccounts),
        checkIsActive(!selectedAccounts),
    ];

    const [currentTab, setCurrentTab] = useState<JSX.Element | null>(null);
    const searchedUsers = useMemo(() => {
        const lowerCaseTerm = searchTerm.toLowerCase()
        return allUsers?.filter((user) => {
            return user.userName
                .toLowerCase()
                .includes(lowerCaseTerm);
        });
    }, [searchTerm, allUsers]);

    useEffect(() => {
        const setAccounts = () => {
            if (!searchedUsers || !searchedUsers.length)
                return (
                    <NoResults
                        className='font-semibold text-xl text-center'
                        text="We haven't found any user 😓"
                    />
                );

            return (
                <div className="flex flex-col gap-3">
                    {searchedUsers.map((user) => {
                        return <Link key={user._id} href={`/profile/${user._id}}`}>
                        <div className='flex items-center xl:items-start gap-3 '>
                            <div className='w-14 h-14'>
                                <Image
                                    src={user?.image}
                                    width={100}
                                    height={100}
                                    className='rounded-full'
                                    alt='user profile'
                                    layout='responsive'
                                />
                            </div>
                            <div className='block'>
                                <p className='flex gap-1 items-center font-bold text-primary lowercase text-lg'>
                                    {user.userName.replaceAll(' ', '')}
                                    <GoVerified className='text-blue-400' />
                                </p>
                                <p className='capitalize text-gray-400 text-base'>
                                    {user.userName}
                                </p>
                            </div>
                        </div>
                    </Link>
                    })}
                </div>
            );
        };

        const setVideos = () => {
            if (!videos?.length)
                return (
                    <NoResults
                        className='font-semibold text-xl text-center'
                        text="We haven't found any videos 😓"
                    />
                );

            return (
                <div className='flex flex-wrap gap-6'>
                    {videos.map((post) => (
                        <VideoCard key={post._id} post={post} />
                    ))}
                </div>
            );
        };

        const element = selectedAccounts ? setAccounts() : setVideos();
        setCurrentTab(element);
        return () => {};
    }, [selectedAccounts, searchTerm, searchedUsers, videos]);

    return (
        <div className='w-full'>
            <div className='flex gap-10 my-10 border-b-2 border-gray-200 bg-white w-full'>
                <p
                    className={`text-center text-xl pb-2 -mb-[2px] font-semibold cursor-pointer ${accountStyle}`}
                    onClick={() => setSelectedAccounts(true)}
                >
                    Accounts
                </p>
                <p
                    className={`text-center text-xl pb-2 -mb-[2px] font-semibold cursor-pointer ${videosStyle}`}
                    onClick={() => setSelectedAccounts(false)}
                >
                    Videos
                </p>
            </div>
            <div className=''>{currentTab}</div>
        </div>
    );
};

export const getServerSideProps = async (args: any) => {
    const searchTerm = args?.params?.searchTerm;
    const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${searchTerm}`
    );

    return {
        props: {
            videos: response?.data ? response.data : null,
        },
    };
};

export default SearchResults;
