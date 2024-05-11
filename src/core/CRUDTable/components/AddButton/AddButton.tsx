import React from 'react';

import './AddButton.css';

import { ReactComponent as PlusIcon } from '../../../../assets/icons/plus.svg';

interface AddButtonProps {
    onClick?: () => void;
}

export const AddButton: React.FC<AddButtonProps> = (props) => {
    return (
        <div className='crud-table__add-button__container' onClick={props.onClick}>
            <PlusIcon />
        </div>
    );
};
