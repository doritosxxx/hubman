type Listener = () => void;

interface Signal {
    emit(): void;

    listen(listener: Listener): VoidFunction;
}

export const createSignal = (): Signal => {
    let listeners: Listener[] = [];

    return {
        emit() {
            for (const listener of listeners) {
                listener();
            }
        },

        listen(listener) {
            listeners.push(listener);

            return () => {
                listeners = listeners.filter(fn => fn !== listener);
            };
        },
    };
};
