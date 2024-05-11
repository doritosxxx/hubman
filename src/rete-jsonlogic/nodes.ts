import { ClassicPreset, GetSchemes } from 'rete';
import { GraphSocket } from './sockets';
import { SelectControl } from './controls';

const inputSocket = new GraphSocket('input');
const outputSocket = new GraphSocket('output');

export interface Variable {
    name: string;
    type: 'String' | 'Integer' | 'Float' | 'Boolean';
}

interface NodeOptions {
    titlePosition: 'top' | 'center' | 'hide';
}

export abstract class BaseNode extends ClassicPreset.Node {
    isRoot = false;
    width = 200;
    height = 100;
    public options: NodeOptions;

    constructor(name: string, options: Partial<NodeOptions> = {}) {
        super(name);

        this.options = {
            titlePosition: options.titlePosition || 'center',
        };

        this.addInput('output', new ClassicPreset.Input(inputSocket, undefined, false));
    }
}

export class VarNode extends BaseNode {
    setCurrent(value?: string) {
        const variable = this.variables.find(variable => variable.name === value) || this.variables[0];
        this.current = variable.name;
    }

    constructor(
        public variables: Variable[],
        public current?: string,
    ) {
        super('Variable', {
            titlePosition: 'hide',
        });

        this.setCurrent(current);

        this.addControl(
            'variable',
            new SelectControl({
                variants: variables.map(variable => variable.name),
                initial: current,
                change: (value) => this.current = value,
            }),
        );
    }
}

export class ValueNode extends BaseNode {
    constructor(public value: string = '') {
        super('Value', {
            titlePosition: 'hide',
        });

        this.addControl('value', new ClassicPreset.InputControl('text', {
            initial: value,
            change: (value) => this.value = value,
        }));
    }
}

export class IfNode extends BaseNode {
    constructor() {
        super('Condition');

        this.addOutput('condition', new ClassicPreset.Output(outputSocket, 'if', false));
        this.addOutput('true', new ClassicPreset.Output(outputSocket, 'true', false));
        this.addOutput('false', new ClassicPreset.Output(outputSocket, 'false', false));
    }
}

export abstract class Operator extends BaseNode {
    public operator: string;

    constructor(name: string, operator: string, options?: Partial<NodeOptions>) {
        super(name, options);

        this.operator = operator;
    }
}

export abstract class BinaryOperator extends Operator {
    constructor(label: string, operator: string, options?: NodeOptions) {
        super(label, operator, options);

        this.addOutput('left', new ClassicPreset.Output(outputSocket, 'x', false));
        this.addOutput('right', new ClassicPreset.Output(outputSocket, 'y', false));
    }
}

const COMPARISON_OPERATORS = ['==', '!=', '<', '<=', '>', '>='] as const;
type ComparisonOperator = typeof COMPARISON_OPERATORS[number];
export function isComparisonOperator(operator: any): operator is ComparisonOperator {
    return COMPARISON_OPERATORS.includes(operator);
}

export class ComparisonNode extends BinaryOperator {
    constructor(operator: ComparisonOperator = '==') {
        super('Comparison', operator, {
            titlePosition: 'hide',
        });

        this.addControl('operator', new SelectControl({
            variants: COMPARISON_OPERATORS,
            initial: operator,
            change: (value) => this.operator = value,
        }));
    }
}

const ARITHMETIC_OPERATOR = ['+', '-', '*', '/', '%'] as const;
type ArithmeticOperator = typeof ARITHMETIC_OPERATOR[number];
export function isArithmeticOperator(operator: any): operator is ArithmeticOperator {
    return ARITHMETIC_OPERATOR.includes(operator);
}

export class ArithmeticNode extends BinaryOperator {
    constructor(operator: ArithmeticOperator = '+') {
        super('Arithmetic', operator, {
            titlePosition: 'hide',
        });

        this.addControl('operator', new SelectControl({
            variants: ARITHMETIC_OPERATOR,
            initial: operator,
            change: (value) => this.operator = value,
        }));
    }
}

const LOGICAL_OPERATOR = ['AND', 'OR'] as const;
type LogicalOperator = typeof LOGICAL_OPERATOR[number];
export function isLogicalOperator(operator: any): operator is LogicalOperator {
    return LOGICAL_OPERATOR.includes(operator);
}

export class LogicalNode extends BinaryOperator {
    constructor(operator: LogicalOperator = 'AND') {
        super('Logical', operator, {
            titlePosition: 'hide',
        });

        this.addControl('operator', new SelectControl({
            variants: LOGICAL_OPERATOR,
            initial: operator,
            change: (value) => this.operator = value,
        }));
    }
}

export class InNode extends BinaryOperator {
    constructor() {
        super('IN', 'in');
    }
}

export abstract class UnaryOperator extends Operator {
    constructor(label: string, operator: string, options?: NodeOptions) {
        super(label, operator, options);

        this.addOutput('arg', new ClassicPreset.Output(outputSocket, undefined, false));
    }
}

export class NegationNode extends UnaryOperator {
    constructor() {
        super('!', '!');
    }
}

const SUPPORTED_FUNCTION_NAME = ['max', 'min', 'cat', 'substr'] as const;
type FunctionName = typeof SUPPORTED_FUNCTION_NAME[number];
export const isSupportedFunctionName = (name: any): name is FunctionName => {
    return SUPPORTED_FUNCTION_NAME.includes(name);
};

export abstract class FunctionCallNode extends BaseNode {
    public name: FunctionName;

    constructor(name: FunctionName, parameters: string[]) {
        super(name);
        this.name = name;

        for (const parameter of parameters) {
            this.addOutput(parameter, new ClassicPreset.Output(outputSocket, parameter, false));
        }
    }
}

export class MaxNode extends FunctionCallNode {
    constructor() {
        super('max', ['1', '2']);
    }
}

export class MinNode extends FunctionCallNode {
    constructor() {
        super('min', ['1', '2']);
    }
}

export class CatNode extends FunctionCallNode {
    constructor() {
        super('cat', ['1', '2']);
    }
}

export class SubstrNode extends FunctionCallNode {
    constructor() {
        super('substr', ['source', 'index', 'length']);
    }
}

/**
 * Temporally not supported.
 */
export class ExpressionNode extends BaseNode {
    constructor() {
        super('Expression', {
            titlePosition: 'hide',
        });

        this.addControl('expression', new ClassicPreset.InputControl('text'));
    }
}

export class ObjectNode extends BaseNode {
    constructor(public fields: string[]) {
        super('Object', {
            titlePosition: 'top',
        });

        for (const name of fields) {
            this.addOutput(name, new ClassicPreset.Output(outputSocket, name, false));
        }
    }
}

export const nodes = [
    IfNode, ExpressionNode, ObjectNode, VarNode, ValueNode,
    CatNode, MaxNode, MinNode, SubstrNode,
    ArithmeticNode, ComparisonNode, LogicalNode, InNode, NegationNode,
]; 

export type Node =
    | IfNode | ExpressionNode | ObjectNode | VarNode | ValueNode
    | CatNode | MaxNode | MinNode | SubstrNode
    | ArithmeticNode | ComparisonNode | LogicalNode | InNode | NegationNode;


class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<
    A,
    B
> { }

export type AllowedConnection = Connection<Node, Node>;

export type Schemes = GetSchemes<Node, AllowedConnection>;
