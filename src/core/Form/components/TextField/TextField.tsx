import React from 'react';

import { Label } from '../Label/Label';

interface TextFieldProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    value,
    onChange,
    required,
}) => {
    const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => onChange ? onChange(event.target.value) : undefined,
        [onChange],
    );

    return (
        <Label label={label || ''}>
            <input
                value={value}
                type='text'
                onChange={handleChange}
                required={required}
            />
        </Label>
    );
};
