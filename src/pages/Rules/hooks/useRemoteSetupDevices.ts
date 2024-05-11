import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';

export const useRemoteSetupDevices = (setupId: number) => {
    const { data: devices, isLoading } = useQuery({
        queryKey: ['setups', setupId, 'devices'],
        queryFn: () => api.fetch<API.Device[]>(`/setups/${setupId}/devices`),

        // Failed checks polling.
        refetchInterval: 2000,
    });

    return {
        devices,
        isLoading,
    };
};
