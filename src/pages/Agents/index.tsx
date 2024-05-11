import React from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

import { LoadingScreen } from '../../core/LoadingScreen/LoadingScreen';
import { TableAgents } from './components/TableAgents.tsx/TableAgents';
import { useRemoteSetupDevices } from '../Rules/hooks/useRemoteSetupDevices';

export const Agents: React.FC = () => {
    const params = useParams<{
        id: string;
    }>();
    const setupId = Number(params.id);

    const { devices, isLoading } = useRemoteSetupDevices(setupId);

    if (isLoading || devices === undefined) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className='agents-page__container'>
            <TableAgents setupId={setupId} devices={devices} />
        </div>
    );
};
