import React from 'react';

import './ActionsCell.css';

import { ReactComponent as PenIcon } from '../../../../assets/icons/pen.svg';
import { ReactComponent as TrashIcon } from '../../../../assets/icons/trash.svg';

interface ActionsCellProps {
    onEdit: VoidFunction;
    onDelete: VoidFunction;
}

export function ActionsCell(props: ActionsCellProps) {
    return (
        <div className='actions-cell__container'>
            <div className='actions-cell__icon-container' onClick={props.onEdit}>
                <PenIcon className='actions-cell__icon' />
            </div>
            <div className='actions-cell__icon-container'>
                <TrashIcon className='actions-cell__icon' onClick={props.onDelete} />
            </div>
        </div>
    );
}
