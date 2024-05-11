import { BaseSchemes } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';

const styles: Partial<CSSStyleDeclaration> = {
    zIndex: '-1',
    position: 'absolute',
    top: '-320000px',
    left: ' -320000px',
    width: '640000px',
    height: '640000px',

    backgroundColor: '#ffffff',
    backgroundImage:
        `linear-gradient(#f1f1f1 3.2px, transparent 3.2px),
        linear-gradient(90deg, #f1f1f1 3.2px, transparent 3.2px),
        linear-gradient(#f1f1f1 1.6px, transparent 1.6px),
        linear-gradient(90deg, #f1f1f1 1.6px, #ffffff 1.6px)`,
    backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
    backgroundPosition:
        `-3.2px -3.2px, 
        -3.2px -3.2px,
        -1.6px -1.6px,
        -1.6px -1.6px;`,
};

export function addBackground<S extends BaseSchemes, K>(
    area: AreaPlugin<S, K>,
) {
    const background = document.createElement('div');

    for (const [property, value] of Object.entries(styles)) {
        background.style[property as any] = value as any;
    }

    area.area.content.add(background);
}
