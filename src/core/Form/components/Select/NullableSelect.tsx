import React from 'react';

import { Select, SelectProps } from './Select';

interface NullableSelectProps extends Omit<SelectProps, 'value' | 'onChange'> {
    nullOption: string;

    value: string | undefined;
    onChange: (value: string | undefined) => void;
}

export const NullableSelect: React.FC<NullableSelectProps> = (props) => {
    const options = React.useMemo(
        () => [{
            value: '',
            text: props.nullOption,
        }, ...props.options],
        [props.options, props.nullOption],
    );

    const onChange = React.useCallback(
        (value: string) => props.onChange(value === '' ? undefined : value),
        [props.onChange],
    );

    return (
        <Select
            label={props.label}
            options={options}
            value={props.value || ''}
            required={props.required}
            onChange={onChange}
        />
    );
};
