import { ClassicPreset } from 'rete';

export class GraphSocket extends ClassicPreset.Socket {
    constructor(type: 'input' | 'output') {
        super(type);
    }
}

export const sockets = [GraphSocket];
