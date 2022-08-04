import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {topics} from '../utils/constants';

const Discover = () => {
    const router = useRouter();

    const {topic} = router.query;

    const activeTopicStyle =
        'xl:border-2 hover:bg-primary xl:border-[#F51997] px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-[#FF1997]';

    const topicStyle =
        'xl:border-2 hover:bg-primary xl:border-gray-300 px-3 py-2 rounded xl:rounded-full flex items-center gap-2 justify-center cursor-pointer text-black';

    return (
        <div className='xl:border-b-2 xl:border-gray-200 pb-4'>
            <p className='text-gray-500 font-semibold mt-4 m-3 hidden xl:block'>
                Popular Topics
            </p>
            <div className='flex gap-3 flex-wrap '>
                {topics.map((item) => (
                    <Link href={`/?topic=${item.name}`} key={item.name}>
                        <div className={item.name === topic ? activeTopicStyle : topicStyle}>
                            <span className='font-bold text-2xl xl:text-base'>
                                {item.icon}
                            </span>
                            <span className='hidden xl:block font-medium text-base '>
                                {item.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Discover;
