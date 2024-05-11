import React from 'react';

import './style.css';

interface ToggleProps {
    enabled?: boolean;
    onToggle?: (value: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({
    enabled,
    onToggle,
}) => {
    const suffix = enabled ? ' enabled' : '';

    return (
        <div
            className='toggle__root'
            onClick={onToggle ? () => onToggle(!enabled) : undefined}
        >
            <div className={`toggle__circle${suffix}`}>
                <div className={`toggle__inner-circle${suffix}`} />
            </div>
        </div>
    );
};
