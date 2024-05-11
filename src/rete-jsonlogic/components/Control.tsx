import React from 'react';

import { SelectControl } from '../controls';

export const SelectControlView = (props: { data: SelectControl }) => {
    const [value, setValue] = React.useState(props.data.current);

    const handleChange = React.useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
        (event) => {
            event.stopPropagation();
            const value = event.target.value;
            setValue(value);
            props.data.change?.(value);
        },
        [setValue],
    );

    return (
        <select
            value={value}
            onPointerDown={(e) => e.stopPropagation()}
            onDoubleClick={(e) => e.stopPropagation()}
            onChange={handleChange}
        >
            {props.data.variants.map(option => (
                <option value={option} key={option}>{option}</option>
            ))}
        </select>
    );
};
