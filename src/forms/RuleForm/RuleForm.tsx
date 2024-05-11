import React from 'react';

import { Form } from '../../core/Form/Form';
import { TextField } from '../../core/Form/components/TextField/TextField';
import { useRemoteSetupDevices } from '../../pages/Rules/hooks/useRemoteSetupDevices';
import { useRemoteDevice } from '../../pages/Rules/hooks/useRemoteDevice';
import { NullableSelect } from '../../core/Form/components/Select/NullableSelect';
import { ButtonsRow } from '../../core/Form/components/ButtonsRow/ButtonsRow';
import { Toggle } from '../../core/Toggle/Toggle';
import { RuleEditor } from '../../core/Form/components/RuleEditor/RuleEditor';
import { Variable } from '../../rete-jsonlogic/nodes';
import { NullLiteral, ObjectPattern } from '../../lib/jsonlogic/ast';

interface HeaderRightSlotProps {
    graphViewEnabled: boolean;
    toggleGraphViewEnabled: VoidFunction;
}

const HeaderRightSlot: React.FC<HeaderRightSlotProps> = (props) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Toggle
                enabled={props.graphViewEnabled}
                onToggle={props.toggleGraphViewEnabled}
            />
            <div style={{ marginLeft: '1.0rem' }}>Graph</div>
        </div>
    );
};

const stringifyId = (id: number | undefined) => id === undefined ? id : id.toString();

const parseId = (id: string | undefined) => id === undefined ? id : +id;

const extractCommandArgs = (
    signals?: API.Describable[], code?: string,
): Variable[] | undefined => {
    if (signals === undefined || code === undefined) {
        return undefined;
    }

    const signal = signals.find(signal => signal.code === code);

    if (!signal) {
        return undefined;
    }

    return Object
        .entries(signal.args)
        .map(([name, type]) => ({
            name: name,
            type: type,
        }));
};

interface RulesFormProps {
    setupId: number;
    title?: string;
    initialData?: POST.Rule;

    onSubmit?: (rule: POST.Rule) => void;
    onCancel?: () => void;
}

export const RulesForm: React.FC<RulesFormProps> = ({
    setupId,
    title,
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [graphViewEnabled, toggleGraphViewEnabled] = React.useReducer((value) => !value, false);
    const [name, setName] = React.useState(initialData?.name);
    const [manipulatorId, setManipulatorId] = React.useState(initialData?.manipulator_id);
    const [executorId, setExecutorId] = React.useState(initialData?.executor_id);
    const [signalCode, setSignalCode] = React.useState(initialData?.signal_code);
    const [commandCode, setCommandCode] = React.useState(initialData?.command_code);
    const [logic, setLogic] = React.useState<string>(initialData?.logic || '');
    const [trigger, setTrigger] = React.useState<string>(initialData?.trigger || '');

    const { devices = [] } = useRemoteSetupDevices(setupId);

    const manipulatorOptions = React.useMemo(
        () => devices
            .filter(device => device.is_manipulator)
            .map(({ id, name }) => ({ text: name, value: String(id) })),
        [devices],
    );
    const executorOptions = React.useMemo(
        () => devices
            .filter(device => device.is_executor)
            .map(({ id, name }) => ({ text: name, value: String(id) })),
        [devices],
    );

    const { device: selectedManipulator } = useRemoteDevice(setupId, manipulatorId);
    const { device: selectedExecutor } = useRemoteDevice(setupId, executorId);

    const signalOptions = React.useMemo(
        () => (selectedManipulator?.signals || []).map(signal => ({
            text: signal.code,
            value: signal.code,
        })),
        [selectedManipulator],
    );

    const signalArgs = React.useMemo(
        () => extractCommandArgs(selectedManipulator?.signals, signalCode),
        [selectedManipulator, signalCode],
    );

    const commandOptions = React.useMemo(
        () => (selectedExecutor?.commands || []).map(command => ({
            text: command.code,
            value: command.code,
        })),
        [selectedExecutor],
    );

    const commandArgs = React.useMemo(
        () => extractCommandArgs(selectedExecutor?.signals, commandCode),
        [selectedExecutor, commandCode],
    );

    const defaultLogicTree = React.useMemo(
        () => new ObjectPattern((commandArgs || []).map(arg => [arg.name, new NullLiteral()])),
        [commandArgs],
    );

    const handleSubmit = onSubmit ? () => {
        if (name === undefined) {
            return;
        }
        if (manipulatorId === undefined) {
            return;
        }
        if (executorId === undefined) {
            return;
        }
        if (signalCode === undefined) {
            return;
        }
        if (commandCode === undefined) {
            return;
        }

        onSubmit({
            name,
            manipulator_id: manipulatorId,
            executor_id: executorId,
            signal_code: signalCode,
            command_code: commandCode,
            logic,
            trigger,
        });
    } : undefined;

    return (
        <Form
            title={title}
            HeaderRightSlot={(
                <HeaderRightSlot
                    graphViewEnabled={graphViewEnabled}
                    toggleGraphViewEnabled={toggleGraphViewEnabled}
                />
            )}
            onSubmit={handleSubmit}
        >
            <TextField
                label='Название:'
                value={name || ''}
                onChange={setName}
                required
            />
            <NullableSelect
                label='Manipulator:'
                value={stringifyId(manipulatorId)}
                nullOption='Не выбран'
                options={manipulatorOptions}
                onChange={(id) => setManipulatorId(parseId(id))}
                required
            />
            <NullableSelect
                label='Signal:'
                value={signalCode}
                nullOption='Не выбран'
                options={signalOptions}
                onChange={setSignalCode}
                required
            />

            {signalArgs ? (
                <div>
                    {signalArgs.map((variable) => (
                        <div key={variable.name}>
                            {variable.name + ': ' + variable.type}
                        </div>
                    ))}
                </div>
            ) : null}

            <NullableSelect
                label='Executor:'
                value={stringifyId(executorId)}
                nullOption='Не выбран'
                options={executorOptions}
                onChange={(id) => setExecutorId(parseId(id))}
                required
            />
            <NullableSelect
                label='Command:'
                value={commandCode}
                nullOption='Не выбран'
                options={commandOptions}
                onChange={setCommandCode}
                required
            />

            {commandArgs ? (
                <div>
                    {commandArgs.map(variable => (
                        <div key={variable.name}>
                            {variable.name + ': ' + variable.type}
                        </div>
                    ))}
                </div>
            ) : null}


            <RuleEditor
                label='Trigger:'
                value={trigger}
                inputVariables={signalArgs}
                onChange={setTrigger}
                graphViewEnabled={graphViewEnabled}
            />

            <RuleEditor
                label='Logic:'
                value={logic}
                inputVariables={signalArgs}
                defaultTree={defaultLogicTree}
                onChange={setLogic}
                graphViewEnabled={graphViewEnabled}
            />

            <div style={{ height: '3.0rem' }} />

            <ButtonsRow
                submitButtonText='Сохранить'
                cancelButtonText='Закрыть'
                onCancel={onCancel}
            />
        </Form>
    );
};
