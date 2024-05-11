import React from 'react';

import './styles.css';

interface ErrorBoxProps {
    error: Error;
    onClose?: VoidFunction;
}

export const ErrorBox: React.FC<ErrorBoxProps> = (props) => {
    return (
        <div className="error-box__container">
            <div className="error-box__close-button" onClick={props.onClose} />
            <div className="error-box__message text--input__title">
                {props.error.message}
            </div>
        </div>
    );
};
