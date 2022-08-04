import React from 'react';
import {NextPage} from 'next';

interface IProps {
    text: string;
    className?: string;
}

const NoResults: NextPage<IProps> = (props) => {
    const classProperties = props?.className ? props.className : '';
    return (
        <div
            className={`w-full h-full flex justify-center items-center ${classProperties}`}
        >
            {props.text}
        </div>
    );
};

export default NoResults;
