import React from 'react';

import { useParams } from 'react-router';
import { LoadingScreen } from '../../core/LoadingScreen/LoadingScreen';
import { CRUDTable } from '../../core/CRUDTable/CRUDTable';
import { useRemoteSetupRules } from './hooks/useRemoteSetupRules';
import { useRemoteSetupDevices } from './hooks/useRemoteSetupDevices';
import { useRuleActions } from './hooks/useRuleActions';
import { usePopup } from '../../core/Popup/PopupProvider';
import { RulesForm } from '../../forms/RuleForm/RuleForm';
import { Confirm } from '../../forms/Confirm/Confirm';

export const Rules: React.FC = () => {
    const params = useParams<{
        id: string;
    }>();
    const setupId = Number(params.id);

    const { rules, isFetching: areRulesFetching } = useRemoteSetupRules(setupId);
    const { devices, isLoading: areDevicesLoading } = useRemoteSetupDevices(setupId);

    if (areRulesFetching || areDevicesLoading || rules === undefined || devices === undefined) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <RulesTable
            setupId={setupId}
            devices={devices}
            rules={rules}
        />
    );
};

const headers = ['Name', 'Manipulator', 'Signal', 'Executor', 'Command'];

const createRowGetter = (devices: API.Device[]) => (rule: API.Rule) => [
    rule.name,
    devices.find(device => device.id === rule.manipulator_id)?.name ?? 'null',
    rule.signal_code,
    devices.find(device => device.id === rule.executor_id)?.name ?? 'null',
    rule.command_code,
];

interface RulesTableProps {
    setupId: number;
    devices: API.Device[];
    rules: API.Rule[];
}

const RulesTable: React.FC<RulesTableProps> = ({
    setupId,
    devices,
    rules,
}) => {
    const actions = useRuleActions(setupId);

    const { setPopupComponent } = usePopup();

    const callbacks = React.useMemo(() => ({
        createRule: () => setPopupComponent(
            <RulesForm
                title='Новое правило'
                setupId={setupId}
                onSubmit={(serialized) => {
                    const data = {
                        ...serialized,
                        logic: JSON.parse(serialized.logic),
                        trigger: JSON.parse(serialized.trigger),
                    };

                    actions
                        .createRule(data)
                        .finally(() => setPopupComponent(null));
                }}
                onCancel={() => setPopupComponent(null)}
            />,
        ),

        patchRule: (rule: API.Rule) => setPopupComponent(
            <RulesForm
                title='Редактирование правила'
                setupId={setupId}
                initialData={{
                    ...rule,
                    logic: JSON.stringify(rule.logic, null, 4),
                    trigger: JSON.stringify(rule.trigger, null, 4),
                }}
                onSubmit={(serialized) => {
                    const data = {
                        ...serialized,
                        logic: JSON.parse(serialized.logic),
                        trigger: JSON.parse(serialized.trigger),
                    };

                    actions
                        .patchRule({
                            id: rule.id,
                            rule: data,
                        })
                        .finally(() => setPopupComponent(null));
                }}
                onCancel={() => setPopupComponent(null)}
            />,
        ),

        deleteRule: (rule: API.Rule) => setPopupComponent(
            <Confirm
                title={`Удалить правило "${rule.name}"?`}
                acceptText='Да'
                rejectText='Отмена'
                onAccept={() => actions
                    .deleteRule(rule)
                    .finally(() => setPopupComponent(null))
                }
                onReject={() => setPopupComponent(null)}
            />,
        ),
    }), [
        actions.createRule,
        actions.deleteRule,
        actions.patchRule,
    ]);

    const getRow = React.useMemo(
        () => createRowGetter(devices),
        [devices],
    );

    return (
        <CRUDTable
            headers={headers}
            data={rules}
            getRow={getRow}

            onCreate={callbacks.createRule}
            onDelete={callbacks.deleteRule}
            onEdit={callbacks.patchRule}
        />
    );
};
