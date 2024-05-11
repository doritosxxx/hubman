import React from 'react';

import { Label } from '../Label/Label';

interface CheckboxFieldProps {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    value,
    onChange,
}) => {
    const handleChange = React.useCallback<React.ChangeEventHandler<HTMLInputElement>>(
        (event) => onChange ? onChange(event.target.checked) : undefined,
        [onChange],
    );

    return (
        <Label label={label || ''}>
            <input
                style={{ width: 'fit-content' }}
                type="checkbox"
                checked={value}
                onChange={handleChange}
            />
        </Label>
    );
};
