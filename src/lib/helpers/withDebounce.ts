type Fn<Args extends unknown[]> = (...args: Args) => void;

export function withDebounce<Args extends unknown[]>(fn: Fn<Args>, debounce: number): Fn<Args> {
    let cancel: VoidFunction | undefined;

    return (...args) => {
        if (cancel) {
            cancel();
            cancel = undefined;
        }

        const timeout = setTimeout(() => {
            fn(...args);
            cancel = undefined;
        }, debounce);

        cancel = () => clearTimeout(timeout);
    };
}
