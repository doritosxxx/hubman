import React from 'react';

import { Form } from '../../core/Form/Form';
import { Label } from '../../core/Form/components/Label/Label';
import { TextField } from '../../core/Form/components/TextField/TextField';
import { CodeEditorField } from '../../core/Form/components/CodeEditorField/CodeEditorField';
import { CheckboxField } from '../../core/Form/components/CheckboxField/CheckboxField';
import { ButtonsRow } from '../../core/Form/components/ButtonsRow/ButtonsRow';

interface AgentFormProps {
    title?: string;
    initialData?: POST.Device;
    showConfigEditor?: boolean;

    onSubmit?: (rule: POST.Device) => void;
    onCancel?: () => void;
}

export const AgentsForm: React.FC<AgentFormProps> = ({
    initialData,
    title,
    showConfigEditor,
    onCancel,
    onSubmit,
}) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const [url, setUrl] = React.useState(initialData?.url || '');
    const [isExecutor, setIsExecutor] = React.useState(initialData?.is_executor || false);
    const [isManipulator, setIsManipulator] = React.useState(initialData?.is_manipulator || false);
    const [userConfig, setUserConfig] = React.useState(initialData?.user_config);

    const handleSubmit = onSubmit ? () => {
        onSubmit({
            name,
            url,
            is_executor: isExecutor,
            is_manipulator: isManipulator,
            user_config: userConfig,
        });
    } : undefined;

    return (
        <Form
            title={title}
            onSubmit={handleSubmit}
        >
            <TextField
                label='Название:'
                value={name}
                onChange={setName}
                required
            />
            <TextField
                label='Url:'
                value={url}
                onChange={setUrl}
                required
            />
            <CheckboxField
                label='Executor'
                value={isExecutor}
                onChange={setIsExecutor}
            />
            <CheckboxField
                label='Manipulator'
                value={isManipulator}
                onChange={setIsManipulator}
            />
            {showConfigEditor && (
                <Label label="Config:">
                    <CodeEditorField
                        mode="jsonlogic"
                        value={userConfig}
                        onChange={setUserConfig}
                    />
                </Label>
            )}

            <div style={{ height: '3.0rem' }} />

            <ButtonsRow
                submitButtonText='Сохранить'
                cancelButtonText='Закрыть'
                onCancel={onCancel}
            />
        </Form>
    );
};

