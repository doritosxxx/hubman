import { ExtendedTypeof } from './type';

export const inferType = (value: unknown): ExtendedTypeof => {
    if (value === null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }

    return typeof value;
};
