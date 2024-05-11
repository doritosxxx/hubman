import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../api';

export const useDeviceActions = (setupId: number) => {
    const queryClient = useQueryClient();

    const { mutateAsync: createDevice } = useMutation<API.Device, unknown, POST.Device>({
        mutationFn: (device) => api.fetch(`/setups/${setupId}/devices`, {
            method: 'POST',
            body: device,
        }),

        onSuccess(device) {
            queryClient.setQueryData<API.Device[]>(
                ['setups', setupId, 'devices'],
                devices => devices ? [...devices, device] : [],
            );
        },
    });

    const { mutateAsync: patchDevice } = useMutation<API.Device, unknown, {
        id: number;
        device: PATCH.Device;
    }>({
        mutationFn: ({ id, device }) => api.fetch(`/setups/${setupId}/devices/${id}`, {
            method: 'PATCH',
            body: device,
        }),

        onSuccess(data) {
            queryClient.setQueryData<API.Device[]>(
                ['setups', setupId, 'devices'],
                devices => devices ? devices.map((device) => device.id === data.id ? data : device) : [],
            );
        },
    });

    const { mutateAsync: deleteDevice } = useMutation<void, unknown, { id: number }>({
        mutationFn: ({ id }) => api.fetch(`/setups/${setupId}/devices/${id}`, {
            method: 'DELETE',
        }),

        onSuccess(data, { id }) {
            queryClient.setQueryData<API.Device[]>(
                ['setups', setupId, 'devices'],
                devices => (devices || []).filter(device => device.id !== id),
            );
        },
    });

    const { mutateAsync: getDevice } = useMutation<API.ExtendedDevice, unknown, { deviceId: number, setupId: number }>(
        {
            mutationFn: ({deviceId, setupId}) => api.fetch(`/setups/${setupId}/devices/${deviceId}`, {
                method: 'GET',
            }),

            onSuccess(data) {
                queryClient.setQueryData<API.Device[]>(
                    ['setups', setupId, 'devices'],
                    devices => devices ? devices.map((device) => device.id === data.id ? data : device) : [],
                );
            },
        },
    );

    return {
        createDevice,
        deleteDevice,
        patchDevice,
        getDevice,
    };
};
