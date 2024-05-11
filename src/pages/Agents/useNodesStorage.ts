import { useInstance } from '../../lib/react/useInstance';

interface LocalStorageKeyControllerParams<D> {
    key: string;
    default: D;

    stringify: (data: D) => string;
    parse: (rawData: string) => D;
}

interface LocalStorageKeyController<D> {
    load: () => D;
    save: (data: D) => void;
}

const createLocalStorageKeyController = <D>(params: LocalStorageKeyControllerParams<D>): LocalStorageKeyController<D> => ({
    save: (data: D) => localStorage.setItem(params.key, params.stringify(data)),

    load: () => {
        const data = localStorage.getItem(params.key);

        if (data === null) {
            return params.default;
        }

        return params.parse(data);
    },
});

interface NodeData {
    id: string | number;
    x: number;
    y: number;
}

export interface NodesStorage {
    set: (data: NodeData) => void;
    remove: (data: Pick<NodeData, 'id'>) => void;

    read: () => NodeData[];
}

const createPersistentNodesStorage = (): NodesStorage => {
    const controller = createLocalStorageKeyController<NodeData[]>({
        key: 'editor__nodes_position',
        default: [],

        stringify: JSON.stringify,
        parse: JSON.parse,
    });

    const parse = (data: NodeData[]) => Object.fromEntries(data.map(({ id, x, y }) => [id, { x, y }]));
    const serialize = (data: ReturnType<typeof parse>): NodeData[] => Object.entries(data).map(([id, { x, y }]) => ({ id, x, y }));

    const buffer = parse(controller.load());

    return {
        set: (data) => {
            buffer[data.id] = data;
            controller.save(serialize(buffer));
        },
        remove: (data) => {
            delete buffer[data.id];
            controller.save(serialize(buffer));
        },

        read: () => serialize(buffer),
    };
};

export const usePersistentNodesStorage = (): NodesStorage => {
    return useInstance(createPersistentNodesStorage);
};
