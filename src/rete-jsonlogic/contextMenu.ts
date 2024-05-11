import { ContextMenuPlugin } from 'rete-context-menu-plugin';

import { setup } from './presets/contextmenu';

import {
    Schemes,

    ComparisonNode,
    LogicalNode,
    MaxNode,
    MinNode,
    SubstrNode,
    InNode,
    VarNode,
    CatNode,
    IfNode,
    ValueNode,
    Variable,
    ArithmeticNode,
    NegationNode,
} from './nodes';

interface ContextMenuParams {
    variables: Variable[];
}

export const contextMenu = (params: ContextMenuParams) => new ContextMenuPlugin<Schemes>({
    items: setup([
        ['Variable', () => new VarNode(params.variables)],
        ['Value', () => new ValueNode()],
        ['Comparison', () => new ComparisonNode()],
        ['Arithmetic', () => new ArithmeticNode()],
        ['Logical', () => new LogicalNode()],
        ['Negation', () => new NegationNode()],
        ['Condition', () => new IfNode()],
        ['Min', () => new MinNode()],
        ['Max', () => new MaxNode()],
        ['Substring', () => new SubstrNode()],
        ['Concat', () => new CatNode()],
        ['IN', () => new InNode()],
    ]),
});
