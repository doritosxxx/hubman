import React from 'react';

import './style.css';

interface LabelProps {
    label: string;
    children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = (props) => {
    return (
        <label className='label__root text--input__title'>
            {props.label}
            {props.children}
        </label>
    );
};
