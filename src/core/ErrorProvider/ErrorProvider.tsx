import React from 'react';


interface IErrorContext {
    logError(error: Error): void;
    errors: readonly Error[];
    consumeErrors: (consumer: (errors: Error[]) => void) => void;
}

const ErrorContext = React.createContext<IErrorContext>(null as never);

interface ErrorProviderProps {
    children: React.ReactElement;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = (props) => {
    const [errors, setErrors] = React.useState<Error[]>([]);

    const errorContext = React.useMemo<IErrorContext>(() => ({
        errors,
        logError: (error) => setErrors(errors => [...errors, error]),
        consumeErrors: (consumer) => {
            consumer(errors);
            setErrors([]);
        },
    }), [errors]);

    return (
        <ErrorContext.Provider value={errorContext}>
            {props.children}
        </ErrorContext.Provider>
    );
};

export const useLogError = () => {
    const logError = React.useContext(ErrorContext).logError;
    return React.useCallback((error: any) => {
        const wrappedError = error instanceof Error ? error : new Error(error);
        logError(wrappedError);
    }, [logError]);
};

type ErrorState = Pick<IErrorContext, 'errors' | 'consumeErrors'>

export const useErrorState = (): ErrorState => {
    return React.useContext(ErrorContext);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useUnhandledRejectionLogging = () => {
    const logError = useLogError();

    React.useEffect(() => {
        const listen = (event: PromiseRejectionEvent) => {
            if (event.reason instanceof Error) {
                logError(event.reason);
            } else if (typeof event.reason === 'string') {
                logError(new Error(event.reason));
            }
        };

        window.addEventListener('unhandledrejection', listen);

        return () => window.removeEventListener('unhandledrejection', listen);
    }, []);
};
