import React from 'react';

import { ReactComponent as PenIcon } from '../../../../assets/icons/pen.svg';
import { ReactComponent as CheckIcon } from '../../../../assets/icons/check.svg';

import './style.css';

export interface MenuItemProps {
    icon?: React.ReactElement;
    text?: string;
    editable?: boolean;

    onClick?: () => void;
    onSave?: (text: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ text, icon, editable, onClick, onSave }) => {
    const content = editable ? (
        <EditableContent
            icon={icon}
            initialText={text}
            onSave={onSave}
        />
    ) : !text && icon ? (
        <IconContent icon={icon} />
    ) : (
        <StaticContent
            icon={icon}
            text={text}
        />
    );

    return (
        <div className={'menu-item__container'} onClick={onClick}>
            {content}
        </div>
    );
};


const onCancelPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
};


interface EditableContentProps {
    icon?: React.ReactElement;
    initialText?: string;
    onSave?: (text: string) => void;
}

export const EditableContent: React.FC<EditableContentProps> = ({ initialText: initialValue = '', onSave, icon }) => {
    const [text, setText] = React.useState(initialValue);
    const [editing, setEditing] = React.useState(false);

    const onTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    const onEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEditing(true);
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setEditing(false);
        onSave && onSave(text);
    };

    return (
        <form className='menu-item--editable' onSubmit={onSubmit}>
            {icon && (
                <div className='menu-item__icon'>
                    {icon}
                </div>
            )}

            {editing ? (
                <input
                    className='menu-item__editable_text text--menu-item'
                    value={text}
                    onInput={onTextInput}
                    onClick={onCancelPropagation}
                    required
                />) : (
                <div
                    className='menu-item__editable_text text--menu-item'
                >
                    {initialValue}
                </div>
            )}
            
            <div className='menu-item__edit-button'>
                {editing ? (
                    <button
                        className='menu-item__edit-button--submit'
                        type='submit'
                        onClick={onCancelPropagation}
                    >
                        <CheckIcon />
                    </button>
                ) : (
                    <div
                        className='menu-item__edit-button--edit'
                        onClick={onEditClick}
                    >
                        <PenIcon />
                    </div>
                )}
            </div>
        </form>
    );
};

interface StaticContentProps {
    icon?: React.ReactElement;
    text?: string;
}

export const StaticContent: React.FC<StaticContentProps> = ({ icon, text }) => {
    return <div className='menu-item--static'>
        <div className='menu-item__icon'>
            {icon}
        </div>
        <div className='text--menu-item'>
            {text}
        </div>
    </div>;
};

interface IconContentProps {
    icon: React.ReactElement;
}

export const IconContent: React.FC<IconContentProps> = ({ icon }) => {
    return (
        <div className='menu-item__icon'>
            {icon}
        </div>
    );
};
