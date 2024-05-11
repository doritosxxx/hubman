import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider as InternalQueryClientProvider, QueryClient } from '@tanstack/react-query';

import { FormPopupProvider } from './core/Popup/PopupProvider';
import { ErrorProvider, useLogError } from './core/ErrorProvider/ErrorProvider';
import { ErrorView } from './core/ErrorProvider/components/ErrorView/ErrorView';

import reportWebVitals from './reportWebVitals';
import { Router } from './router';

import './css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const QueryClientProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const logError = useLogError();

    const [queryClient] = React.useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: Infinity,
                retry: false,
                refetchOnMount: false,
                retryOnMount: false,
                throwOnError: true,
            },
            mutations: {
                throwOnError: false,
                onError: logError,
            },
        },
    }));

    return (
        <InternalQueryClientProvider client={queryClient}>
            {children}
        </InternalQueryClientProvider>
    );
};

root.render(
    <React.StrictMode>
        <ErrorProvider>
            <QueryClientProvider>
                <ErrorView>
                    <FormPopupProvider>
                        <Router />
                    </FormPopupProvider>
                </ErrorView>
            </QueryClientProvider>
        </ErrorProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
