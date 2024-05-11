import React from 'react';

export const useInstance = <I>(ctor: () => I): I => {
    const instanceRef = React.useRef<I | undefined>();

    if (!instanceRef.current) {
        instanceRef.current = ctor();
    }

    return instanceRef.current;
};
