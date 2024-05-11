import { ClassicPreset } from 'rete';

interface SelectControlOptions {
    variants?: string[] | readonly string[];
    initial?: string;
    change?: (value: string) => void;
}

export class SelectControl extends ClassicPreset.Control {
    public current?: string;
    public variants: string[] | readonly string[];
    public change?: (value: string) => void;

    constructor(options: SelectControlOptions = {}) {
        super();

        this.variants = options.variants || [];
        this.change = options.change;

        const initial = options.initial;
        if (initial && this.variants.includes(initial)) {
            this.current = initial;
        }
    }
}

export const controls = [SelectControl];
