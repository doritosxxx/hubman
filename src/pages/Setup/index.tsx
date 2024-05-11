import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './style.css';

import { Tabs } from './components/Tabs';
import { Agents } from '../Agents';
import { Rules } from '../Rules';
const pages = ['agents', 'rules'] as const;

const WORKSPACE_ITEMS = [
    {
        text: 'Rules',
        routePage: 'rules',
        component: <Rules />,
    },
    {
        text: 'Agents',
        routePage: 'agents',
        component: <Agents />,
    },
];

export const SetupPage: React.FC = () => {
    const navigate = useNavigate();

    const params = useParams<{
        id: string;
        page: typeof pages[number];
    }>();

    const tabs = React.useMemo(() => WORKSPACE_ITEMS.map((tab) => ({
        ...tab,
        onClick() {
            navigate(`/setup/${params.id}/${tab.routePage}`);
        },
    })), [WORKSPACE_ITEMS, params.id]);

    const index = WORKSPACE_ITEMS.findIndex(({ routePage }) => routePage === params.page);
    const activeItem = index === -1 ? 0 : index;

    return (
        <div className='workspace__root'>
            <div className='workspace__viewport'>  
                {WORKSPACE_ITEMS[index].component}
                <div className="workspace__viewport__placeholder" />
            </div>
            <Tabs activeItem={activeItem} tabs={tabs} />
        </div>
    );
};

