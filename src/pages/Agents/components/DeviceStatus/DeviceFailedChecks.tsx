import React from 'react';

interface DeviceFailedChecksProps {
    checks: DeviceCheck[];
}

export const DeviceFailedChecks: React.FC<DeviceFailedChecksProps> = (props) => {
    const items = props.checks.length === 0 ? (
        <div className='device-failed-checks__item' />
    ) : props.checks.map(({ label, description }, index) => (
        <div key={index} className='device-failed-checks__item'>
            <div className='device-failed-checks__label'>{label}</div>
            <div className='device-failed-checks__description'>{description}</div>
        </div>
    ));

    return (
        <div className='device-failed-checks__container'>
            {items}
        </div>
    );
};
