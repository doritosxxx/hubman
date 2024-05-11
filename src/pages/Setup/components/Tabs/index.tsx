import React from 'react';

import './style.css';

const tabClassNames = {
    default: 'tab_container',
    active: 'tab_container tab_container--active',
};

interface TabProps {
    text: string;
    active?: boolean;

    onClick: VoidFunction;
}

const Tab: React.FC<TabProps> = ({ text, onClick, active }) => {
    return (
        <div
            onClick={onClick}
            className={active ? tabClassNames.active : tabClassNames.default}
        >
            <div className='tab__content text--header'>
                {text}
            </div>
        </div>
    );
};

interface TabsProps {
    tabs: TabProps[];

    activeItem: number;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeItem }) => {
    const ReversedTabs = React.useMemo(() => tabs.map((tab, index) => (
        <Tab
            key={tab.text}
            text={tab.text}
            onClick={tab.onClick}
            active={index === activeItem}
        />
    )).reverse(), [tabs, activeItem]);


    return <div className='tabs__container'>
        {ReversedTabs}
    </div>;
};
