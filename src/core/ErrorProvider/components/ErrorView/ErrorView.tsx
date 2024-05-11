import React from 'react';
import { ErrorBox } from '../ErrorBox/ErrorBox';
import { useErrorState } from '../../ErrorProvider';

import './style.css';

interface IdentifiableError extends Error {
    id: number;
}

interface ErrorViewProps {
    children: React.ReactElement;
}

export const ErrorView: React.FC<ErrorViewProps> = (props) => {
    const { errors: caughtErrors, consumeErrors } = useErrorState();
    const [errors, setErrors] = React.useState<IdentifiableError[]>([]);
    const nextErrorIdRef = React.useRef(0);

    React.useEffect(() => {
        if (caughtErrors.length) {
            consumeErrors(incomingErrors => {
                const tail = incomingErrors.map(error => {
                    const identifiableError = error as IdentifiableError;
                    identifiableError.id = nextErrorIdRef.current++;
                    return identifiableError;
                });

                setErrors(errors => [...errors, ...tail]);
            });
        }
    }, [caughtErrors]);

    return (
        <div className='error-view__root'>
            {props.children}
            <div className='error-view__container'>
                {errors.map((error) => (
                    <ErrorBox
                        key={error.id}
                        error={error}
                        onClose={() => setErrors(errors => errors.filter(item => item.id !== error.id))}
                    />
                ))}
            </div>
        </div>
    );
};
