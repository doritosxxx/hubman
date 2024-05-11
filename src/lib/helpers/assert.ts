import { inferType } from './inferType';
import { ExtendedTypeof, Remap } from './type';

export function assertType<T extends ExtendedTypeof>(value: unknown, types: T[]): asserts value is Remap<T> {
    const received = inferType(value);

    if (!types.includes(received as T)) {
        const serializedType = types.map(type => `"${type}"`).join(' | ');
        throw new TypeError(`Expected ${serializedType} type, "${received}" received.`, {
            cause: value,
        });
    }
}

export function assertString(value: unknown): asserts value is string {
    return assertType(value, ['string']);
}

export function assertObject<V = unknown>(value: unknown): asserts value is Record<string, V> {
    return assertType(value, ['object']);
}

export function assertArray<T = unknown>(value: unknown): asserts value is T[] {
    return assertType(value, ['array']);
}
