import React from 'react';

import { Form } from '../../core/Form/Form';
import { ButtonsRow } from '../../core/Form/components/ButtonsRow/ButtonsRow';

interface ConfirmProps {
    title: string;
    acceptText: string;
    rejectText: string;

    onAccept: VoidFunction;
    onReject: VoidFunction;
}

export const Confirm: React.FC<ConfirmProps> = (props) => {
    return (
        <Form
            title={props.title}
            onSubmit={props.onAccept}
        >
            <ButtonsRow
                submitButtonText={props.acceptText}
                cancelButtonText={props.rejectText}
                onCancel={props.onReject}
            />
        </Form>
    );
};
