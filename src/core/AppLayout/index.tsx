import React from 'react';

import { Outlet } from 'react-router-dom';

import { Header } from '../Header';
import { LeftBar } from '../LeftBar';

import { MenuItemProps } from '../LeftBar/components/MenuItem';

import './style.css';

interface AppLayoutProps {
    menuItems: (MenuItemProps & { key: React.Key })[];
    header: {
        text: string,
        children?: React.ReactElement;
    }
}

export const AppLayout: React.FC<AppLayoutProps> = ({ menuItems, header }) => {
    return (
        <div className='app-layout__container--vertical'>
            <LeftBar items={menuItems} />
            <div className='app-layout__container--horizontal'>
                <Header text={header.text}>
                    {header.children}
                </Header>
                <div className='app-layout__view'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
