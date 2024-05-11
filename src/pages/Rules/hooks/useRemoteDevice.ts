import { useQuery } from '@tanstack/react-query';
import { api } from '../../../api';

export const useRemoteDevice = (setupId: number, deviceId: number | undefined) => {
    const enabled = typeof deviceId === 'number';

    const { data: device, isFetching } = useQuery({
        queryKey: ['setups', setupId, 'devices', deviceId],
        queryFn: () => api.fetch<API.ExtendedDevice>(`/setups/${setupId}/devices/${deviceId}`),

        enabled,
    });

    return {
        device: enabled ? device : undefined,
        isFetching,
    };
};
