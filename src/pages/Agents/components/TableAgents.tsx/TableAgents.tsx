import React from 'react';

import { CRUDTable } from '../../../../core/CRUDTable/CRUDTable';
import { usePopup } from '../../../../core/Popup/PopupProvider';

import { useDeviceActions } from '../../hooks/useDeviceActions';
import { AgentsComponentProps } from '../../AgentsProps';
import { AgentsForm } from '../../../../forms/AgentForm/AgentForm';
import { Confirm } from '../../../../forms/Confirm/Confirm';
import { DeviceStatus } from '../DeviceStatus/DeviceStatus';

const headers = ['Name', 'Type', 'Url', 'Checks'];

const getName = ({ is_executor, is_manipulator }: API.Device) =>
    is_executor && is_manipulator ? 'Hermaphrodite' :
        is_manipulator ? 'Manipulator' : 'Executor';

const getRow = (device: API.ExtendedDevice) => [
    device.name,
    getName(device),
    device.url,
    <DeviceStatus key="checks" checks={device.failed_checks} />,
];

export const TableAgents: React.FC<AgentsComponentProps> = ({ devices, setupId }) => {
    const actions = useDeviceActions(setupId);

    const { setPopupComponent } = usePopup();

    const callbacks = React.useMemo(() => ({
        createDevice: () => setPopupComponent(
            <AgentsForm
                title='Новый агент'
                onCancel={() => setPopupComponent(null)}
                onSubmit={(serialized) => {
                    const data = serialized;
                    data.user_config = data.user_config ? JSON.parse(data.user_config) : '';

                    actions
                        .createDevice(data)
                        .finally(() => setPopupComponent(null));
                }}
            />,
        ),

        patchDevice: (device: API.Device) => actions.getDevice({ deviceId: device.id, setupId: device.setup_id }).then((device) => setPopupComponent(
            <AgentsForm
                title={device.name}
                showConfigEditor
                initialData={{
                    ...device,
                    user_config: JSON.stringify(device.user_config, null, 4),
                }}
                onCancel={() => setPopupComponent(null)}
                onSubmit={(serialized) => {
                    const data = serialized;
                    data.user_config = data.user_config ? JSON.parse(data.user_config) : '';

                    actions
                        .patchDevice({ id: device.id, device: data })
                        .finally(() => setPopupComponent(null));
                }}
            />,
        )),

        deleteDevice: (device: API.Device) => setPopupComponent(
            <Confirm
                title={`Удалить агент "${device.name}"?`}
                acceptText='Да'
                rejectText='Отмена'
                onAccept={() => actions
                    .deleteDevice(device)
                    .finally(() => setPopupComponent(null))
                }
                onReject={() => setPopupComponent(null)}
            />,
        ),
    }), [
        actions.createDevice,
        actions.deleteDevice,
        actions.patchDevice,
        actions.getDevice,
    ]);

    return (
        <CRUDTable
            headers={headers}
            data={devices}
            getRow={getRow}

            onCreate={callbacks.createDevice}
            onEdit={callbacks.patchDevice}
            onDelete={callbacks.deleteDevice}
        />
    );
};
