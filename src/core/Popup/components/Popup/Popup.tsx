import React from 'react';

import './style.css';

interface PopupProps {
    children: React.ReactNode;
    viewportWidth?: string;
    viewportHeight?: string;
}

export const Popup: React.FC<PopupProps> = ({
    children,
    viewportWidth,
    viewportHeight,
}) => {

    return (
        <div className='popup__root'>
            <div className='popup__viewport' style={{
                width: viewportWidth,
                height: viewportHeight,
            }}>
                {children}
            </div>
        </div>
    );
};
