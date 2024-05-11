import React from 'react';

import './style.css';

export interface ButtonProps {
    children: string;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'tertiary';
    onClick?: VoidFunction;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'tertiary',
    type = 'button',
    onClick,
}) => (
    <button
        className={`form-button form-button--${variant} text--button`}
        onClick={onClick}
        type={type}
    >
        {children}
    </button>
);
