import React from 'react';
import { Label } from '../Label/Label';

interface SelectOption {
    value: string,
    text: string,
}

export interface SelectProps {
    label?: string;
    options: SelectOption[];
    value: string;
    required?: boolean;

    onChange: (value: string) => void;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    value,
    required,
    onChange,
}) => {
    const handleChange = React.useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
        (event) => onChange ? onChange(event.target.value) : undefined,
        [onChange],
    );

    return (
        <Label label={label || ''}>
            <select
                value={value}
                onChange={handleChange}
                required={required}
            >
                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.text}
                    </option>
                ))}
            </select>
        </Label>
    );
};
