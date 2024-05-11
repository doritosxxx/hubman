import React from 'react';

import './style.css';

interface HeaderProps {
    children?: React.ReactElement;
    text?: string;
}

export const Header: React.FC<HeaderProps> = ({ text, children }) => {
    return (
        <div className="header__container">
            {
                text ? (
                    <div className="text--header header__text">
                        {text}
                    </div>
                ) : null
            }
            {children}
        </div>
    );
};
