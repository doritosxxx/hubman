import React from 'react';

import { ReactComponent as GreenHeart } from '../../../../assets/icons/green-heart.svg';
import { ReactComponent as MendingHeart } from '../../../../assets/icons/mending-heart.svg';
import { DeviceFailedChecks } from './DeviceFailedChecks';

import './style.css';

const Aligner: React.FC<{ children: React.ReactNode }> = (props) => {
    return (
        <div className='device-status__aligner'>
            {props.children}
        </div>
    );
};

interface DeviceStatusProps {
    checks: DeviceCheck[];
}

export const DeviceStatus: React.FC<DeviceStatusProps> = (props) => {
    const checks = props.checks || [];
    const [overlayVisible, setOverlayVisible] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const callbacks = React.useMemo(() => ({
        onMouseEnter: () => {
            if (checks.length) {
                setOverlayVisible(true);
            }
        },
        onMouseLeave: () => setOverlayVisible(false),
    }), []);

    return (
        <div
            className='device-status__container'
            ref={containerRef}
            onMouseEnter={callbacks.onMouseEnter}
            onMouseLeave={callbacks.onMouseLeave}
        >
            {checks.length ? (
                <div style={{ position: 'relative' }}>
                    <MendingHeart />
                    {overlayVisible && (
                        <Aligner>
                            <DeviceFailedChecks checks={checks} />
                        </Aligner>
                    )}
                </div>
            ) : (
                <GreenHeart />
            )}

        </div>
    );
};
