import * as React from 'react';

import { Button } from '../Button/Button';

import './style.css';

interface ButtonsRowProps {
    onCancel?: VoidFunction;
    submitButtonText: string;
    cancelButtonText: string;
}

export const ButtonsRow: React.FC<ButtonsRowProps> = ({
    onCancel,
    submitButtonText,
    cancelButtonText,
}) => {
    return (
        <div className='form__buttons-row'>
            <Button
                variant='primary'
                type='submit'
            >
                {submitButtonText}
            </Button>
            <Button onClick={onCancel} >
                {cancelButtonText}
            </Button>
        </div>
    );
};
