import React from 'react';
import { Popup } from './components/Popup/Popup';

interface PopupContextProps {
    setPopupComponent: (component: React.ReactElement | null) => void;
}

const PopupContext = React.createContext<PopupContextProps | null>(null);

export const usePopup = () => {
    const context = React.useContext(PopupContext);

    if (!context) {
        throw new Error('PopupProvider was not provided on usePopup call');
    }

    return context;
};

interface FormPopupProviderProps {
    children: React.ReactNode;
}

export const FormPopupProvider: React.FC<FormPopupProviderProps> = ({ children }) => {
    const [Component, setPopupComponent] = React.useState<React.ReactElement | null>(null);
    const contextValue = React.useMemo(() => ({ setPopupComponent }), [setPopupComponent]);

    return (
        <PopupContext.Provider value={contextValue}>
            {children}
            {Component ? (
                <Popup viewportWidth={'60.0rem'}>
                    {Component}
                </Popup>
            ) : null}
        </PopupContext.Provider>
    );
};
