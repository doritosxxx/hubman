import React from 'react';

import { ReactComponent as ExpandIcon } from '../../../../assets/icons/expand.svg';
import { ReactComponent as ShrinkIcon } from '../../../../assets/icons/shrink.svg';

import './style.css';

const ANIMATION_DURATION = 200;
const FULLSCREEN_FRAME_MARGIN = '6.0rem';

const calculateWindowAbsoluteInset = (rect: {
    left: number;
    right: number;
    bottom: number;
    top: number;
}) => [
    // top
    window.scrollY + rect.top + 'px',
    // right
    window.innerWidth - (rect.right) + 'px',
    // bottom
    window.innerHeight - (rect.bottom) + 'px',
    // left
    window.scrollX + rect.left + 'px',
].join(' ');

interface ExpandableViewProps {
    children: React.ReactNode;
    onAnimationStart?: VoidFunction;
    onAnimationEnd?: VoidFunction;
}

export const ExpandableView: React.FC<ExpandableViewProps> = (props) => {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const previousValue = React.useRef<boolean | undefined>(undefined);
    const [expanded, toggleExpanded] = React.useReducer((value) => !value, false);

    React.useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }

        const element = root.firstChild as HTMLDivElement | null; 
        if (!element) {
            return;
        }

        let animationFrame: number | undefined;
        let timeout: number | undefined;

        const rect = root.getBoundingClientRect();

        if (previousValue.current !== undefined) {
            props.onAnimationStart?.();
        }

        if (expanded) {
            animationFrame = requestAnimationFrame(() => {
                element.style.position = 'fixed';
                element.style.zIndex = '3';
                element.style.height = 'unset';
                element.style.inset = calculateWindowAbsoluteInset(rect);

                animationFrame = requestAnimationFrame(() => {
                    element.style.inset = Array(4).fill(FULLSCREEN_FRAME_MARGIN).join(' ');
                    animationFrame = undefined;

                    timeout = window.setTimeout(() => {
                        props.onAnimationEnd?.();
                    }, ANIMATION_DURATION);                    
                });
            });
        } else if (previousValue.current === true) {
            animationFrame = requestAnimationFrame(() => {
                element.style.inset = calculateWindowAbsoluteInset(rect);
                animationFrame = undefined;
            });

            timeout = window.setTimeout(() => {
                element.style.removeProperty('position');
                element.style.removeProperty('z-index');
                element.style.removeProperty('height');
                element.style.removeProperty('inset');

                props.onAnimationEnd?.();
            }, ANIMATION_DURATION);
        } 

        previousValue.current = expanded;

        return () => {
            if (animationFrame !== undefined) {
                cancelAnimationFrame(animationFrame);
            }
            if (timeout !== undefined) {
                clearTimeout(timeout);
            }
        };
    }, [expanded]);

    return (
        <div ref={rootRef} className="expandable-view__root" >
            <div className="expandable-view__plug">
                {props.children}
                <div className='expandable-view__toggle-button' onClick={toggleExpanded}>
                    {expanded && (
                        <ShrinkIcon />
                    )}
                    {!expanded && (
                        <ExpandIcon />
                    )}
                </div>
            </div>
        </div>
    );
};
