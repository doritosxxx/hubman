import React from 'react';

import { Form } from '../../core/Form/Form';
import { TextField } from '../../core/Form/components/TextField/TextField';
import { ButtonsRow } from '../../core/Form/components/ButtonsRow/ButtonsRow';

interface SetupFormProps {
    title?: string;
    initialData?: POST.Setup;

    onSubmit?: (rule: POST.Setup) => void;
    onCancel?: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({
    title,
    initialData,

    onSubmit,
    onCancel,
}) => {
    const [name, setName] = React.useState(initialData?.name || '');
    const handleSubmit = onSubmit ? () => {
        onSubmit({ name });
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

            <div style={{ height: '3.0rem' }} />

            <ButtonsRow
                submitButtonText='Сохранить'
                cancelButtonText='Закрыть'
                onCancel={onCancel}
            />
        </Form>
    );
};
