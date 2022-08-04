import React, {useState} from 'react';
import {NextPage} from 'next';
import {useRouter} from 'next/router';
import Link from 'next/link';
import GoogleLogin from 'react-google-login';
import {AiOutlineMenu, AiFillHome} from 'react-icons/ai';
import {ImCancelCircle} from 'react-icons/im';
import DiscoverTag from './DiscoverTag';
import SuggestedAccounts from './SuggestedAccounts';
import FooterTag from './FooterTag';

const SideBar = () => {
    const [showSideBar, setShowSideBar] = useState(true);

    const userProfile = false;

    const getCircleIcon = () =>
        showSideBar ? <ImCancelCircle /> : <AiOutlineMenu />;

    const normalLink =
        'flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start font-semibold text-[#F51997] cursor-pointer rounded';

    return (
        <div>
            <div
                className=' block xl:hidden m-2 ml-4 mt-3 text-xl cursor-pointer'
                onClick={() => setShowSideBar((prev) => !prev)}
            >
                {getCircleIcon()}
            </div>
            {showSideBar && (
                <div className='xl:w-400 w-20 flex flex-col justify-start mb-10 border-r-2 border-gray-100 xl:border-0 p-3 h-[100vh]'>
                    <div className='xl:border-b-2 border-gray-200 xl:pb-4'>
                        <Link href='/'>
                            <div className={normalLink}>
                                <p className='text-2xl'>
                                    <AiFillHome />
                                </p>
                                <span className='text-xl hidden xl:block'>
                                    For you
                                </span>
                            </div>
                        </Link>
                    </div>
                    <DiscoverTag />
                    <SuggestedAccounts />
                    <FooterTag />
                </div>
            )}
        </div>
    );
};

export default SideBar;
