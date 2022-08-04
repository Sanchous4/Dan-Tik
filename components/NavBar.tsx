import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {GoogleLogin, googleLogout} from '@react-oauth/google';
import {AiOutlineLogout} from 'react-icons/ai';
import {BiSearch} from 'react-icons/bi';
import {IoMdAdd} from 'react-icons/io';
import Logo from '../utils/tiktik-logo.png';
import {createOrGetUser} from '../utils';
import useAuthStore from '../store/authStore';
import {inputAndFormEvent} from '../types';

const NavBar = () => {
    // const {userProfile, addUser} = useAuthStore((state) => {
    //     return {userProfile: state.userProfile, addUser: state.addUser};
    // });

    const {userProfile, addUser, removeUser} = useAuthStore();
    const [inputSearch, setInputSearch] = useState('');
    const router = useRouter();

    const handleSearch = async (event: inputAndFormEvent) => {
        event.preventDefault();
        if (inputSearch?.length > 0) {
            router.push(`/search/${inputSearch}`);
            return;
        }
        router.push('/');
    };

    const doLogout = () => {
        googleLogout();
        removeUser();
    };

    return (
        <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
            <Link href='/'>
                <div className='w-[150px] h-[38px] md:w-[160px] md:h-[40px] relative '>
                    <Image
                        className='cursor-pointer logo-filter'
                        src={Logo}
                        alt='Dan‘Tik'
                        layout='fill'
                        objectFit='contain'
                        priority={false}
                    />
                </div>
            </Link>
            <div className='relative hidden md:block w-[40%]'>
                <form className=' bg-white w-full' onSubmit={handleSearch}>
                    <input
                        className='rounded bg-primary p-3 text-base border-gray-100 outline-none border-2 focus:border-gray-300 w-full'
                        type='text'
                        value={inputSearch}
                        onChange={(e) => setInputSearch(e.target.value)}
                        placeholder='Type to search...'
                    />
                    <button
                        onClick={handleSearch}
                        className='absolute right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400'
                    >
                        <BiSearch />
                    </button>
                </form>
            </div>
            <div>
                {userProfile ? (
                    <div className='flex gap-5 md:gap-10'>
                        <Link href='/upload'>
                            <button className='border-2 py-1 px-2 md:px-4 text-base font-semibold flex justify-center gap-2 items-center'>
                                <IoMdAdd className='text-xl' /> {` `}
                                <span className='hidden md:block'>Upload</span>
                            </button>
                        </Link>
                        {userProfile?.image && (
                            <Link href={`/profile/${userProfile._id}`}>
                                <div className='m-0 p-0 flex justify-center items-center'>
                                    <Image
                                        width={40}
                                        height={40}
                                        className='rounded-full cursor-pointer'
                                        src={userProfile?.image}
                                        alt='profile photo'
                                        priority={false}
                                        // layout='responsive'
                                    />
                                </div>
                            </Link>
                        )}
                        <button
                            type='button'
                            className='px-2'
                            onClick={doLogout}
                        >
                            <AiOutlineLogout color='red' fontSize={24} />
                        </button>
                    </div>
                ) : (
                    <GoogleLogin
                        onSuccess={(response) => {
                            createOrGetUser(response, addUser, doLogout);
                        }}
                        onError={() => {}}
                    />
                )}
            </div>
        </div>
    );
};

export default NavBar;
