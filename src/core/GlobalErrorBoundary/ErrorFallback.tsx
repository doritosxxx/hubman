import React from 'react';
import './style.css';
import { useLocation, useNavigate, useRouteError } from 'react-router-dom';

export const ErrorFallback: React.FC = () => {
    const throwable = useRouteError();
    const error = throwable instanceof Error ? throwable : undefined;
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="error-fallback">
            <div className="error-fallback__title text--header">Что-то пошло не так</div>
            {error ? (
                <div className="error-fallback__message">{error.message}</div>
            ) : null}
            {error?.stack ? (
                <pre className="error-fallback__stacktrace">{error.stack}</pre>
            ) : null}
            <button
                className='error-fallback__reset-button text--button'
                onClick={() => navigate(location)}
            >Перезагрузить</button>
        </div>
    );
};
