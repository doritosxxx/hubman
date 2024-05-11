import React from 'react';

import './style.css';

interface FormProps {
    title?: string;
    HeaderRightSlot?: React.ReactNode;
    children: React.ReactNode;
    onSubmit?: VoidFunction;
}

export const Form: React.FC<FormProps> = ({
    title,
    HeaderRightSlot,
    children,
    onSubmit,
}) => {
    const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(
        (event) => {
            event.preventDefault();

            if (onSubmit) {
                onSubmit();
            }
        },
        [onSubmit],
    );

    return (
        <form onSubmit={handleSubmit}>
            <div className='form__container'>
                <div className='form__header text--header'>
                    {title || ''}
                    <div className='form__header-separator' />
                    {HeaderRightSlot}
                </div>
                <div className="form__inputs-container">
                    {children}
                </div>
            </div>
        </form>
    );
};
