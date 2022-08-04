import '../styles/globals.css';
import type {AppProps} from 'next/app';
import {useEffect, useMemo, useState} from 'react';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {useRouter} from 'next/router';
import Head from 'next/head';
import useAuthStore from '../store/authStore';
// import favicon from '../public/favicon.ico'
// import 'tailwindcss/tailwind.css'

const MyApp = ({Component, pageProps}: AppProps) => {
    const [isSSR, setIsSSR] = useState(true);
    useEffect(() => {
        setIsSSR(false);
    }, []);
    const router = useRouter();

    const {likeCallback, setLikeCallback , setLikeRoute, likeRoute} = useAuthStore();

    useEffect(() => {
        const callPromise = likeCallback.isValid && likeRoute !== router.asPath && likeRoute?.includes('detail')
        if (callPromise) {
            likeCallback.callback();
            setLikeCallback({isValid: false, callback: async () => {}});
            setLikeRoute('');
        }
    }, [likeCallback, router]);

    const SideBarShouldBeShowed = useMemo(
        () =>
            !router.asPath.includes('upload') &&
            !router.asPath.includes('detail'),
        [router]
    );

    const NavBarShouldBeShowed = useMemo(
        () => !router.asPath.includes('detail'),
        [router]
    );

    if (isSSR) return null;

    return (
        <GoogleOAuthProvider
            clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}
        >
            <Head>
                <title>Dan`Tik</title>
                <meta
                    name='viewport'
                    content='initial-scale=1.0, width=device-width'
                />
                <link rel='icon' href='/favicon/favicon.ico' />
            </Head>
            <div className='xl:w-[1200px] m-auto overflow-hidden xl:hover:overflow-auto'>
                {NavBarShouldBeShowed && <NavBar />}
                <div className='flex gap-6 md:gap-20'>
                    {SideBarShouldBeShowed && (
                        <div className='h-[92vh] overflow-y-auto'>
                            <SideBar />
                        </div>
                    )}
                    <div className='mt-4 flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
                        <Component {...pageProps} />
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default MyApp;
