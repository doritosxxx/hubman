declare namespace API {
    interface Descriptor {
        id: number;
        code: string;
        description: string;
        structure: Record<string, 'integer' | 'string'>;
    }
}
