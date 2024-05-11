import React from 'react';

import { Logo } from './components/Logo';
import { MenuItemProps, MenuItem } from './components/MenuItem';

import './style.css';

interface LeftBarProps {
    items: (MenuItemProps & { key: React.Key })[];
}

export const LeftBar: React.FC<LeftBarProps> = ({ items }) => {
    return (
        <div className='left-bar__container'>
            <Logo key="logo" />
            {items.map(props => (
                <MenuItem
                    icon={props.icon}
                    text={props.text}
                    editable={props.editable}

                    onClick={props.onClick}
                    onSave={props.onSave}
                    key={props.key}
                />
            ))}
        </div>
    );
};
