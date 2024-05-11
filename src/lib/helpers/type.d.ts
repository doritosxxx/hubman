export type ExtendedTypeofRemap = {
    'number': number;
    'bigint': bigint;
    'string': string;
    'boolean': boolean;
    'object': Record<string, unknown>;
    'undefined': undefined;
    'symbol': symbol;
    'function': function;

    // + non-standard.
    'array': unknown[];
    'null': null;
};

export type ExtendedTypeof = keyof ExtendedTypeofRemap;

export type Remap<V extends ExtendedTypeof> = V extends unknown ? ExtendedTypeofRemap[V] : never;
