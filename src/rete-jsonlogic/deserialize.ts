import {
    Node,
    Variable,

    ArithmeticNode,
    CatNode,
    ComparisonNode,
    InNode,
    IfNode,
    MaxNode,
    MinNode,
    LogicalNode,
    ObjectNode,
    SubstrNode,
    ValueNode,
    VarNode,
    NegationNode,
    isComparisonOperator,
    isArithmeticOperator,
    isLogicalOperator,
} from './nodes';
import {
    Expression,

    VarExpression,
    BinaryExpression,
    UnaryExpression,
    IfExpression,
    CallExpression,
    ArrayPattern,
    ObjectPattern,
    Literal,
} from '../lib/jsonlogic/ast';

export const deserializeNode = (node: Expression, variables: Variable[]): Node | null => {
    if (node instanceof VarExpression) {
        return new VarNode(variables, node.name);
    } else if (node instanceof BinaryExpression) {
        const uppercase = node.operator.toUpperCase();

        if (isComparisonOperator(node.operator)) {
            return new ComparisonNode(node.operator);
        } else if (isArithmeticOperator(node.operator)) {
            return new ArithmeticNode(node.operator);
        } else if (isLogicalOperator(uppercase)) {
            return new LogicalNode(uppercase);
        } else if (node.operator === 'in') {
            return new InNode();
        } else {
            throw new Error(`Unsupported binary operator type: "${node.operator}"`);
        }
    } else if (node instanceof UnaryExpression) {
        if (node.operator === '!') {
            return new NegationNode();
        } else {
            throw new Error(`Unsupported unary operator type: "${node.operator}"`);
        }
    } else if (node instanceof IfExpression) {
        return new IfNode();
    } else if (node instanceof CallExpression) {
        if (node.callee === 'min') {
            return new MinNode();
        } else if (node.callee === 'max') {
            return new MaxNode();
        } else if (node.callee === 'cat') {
            return new CatNode();
        } else if (node.callee === 'substr') {
            return new SubstrNode();
        } else {
            throw new Error(`Unsupported function call: "${node.callee}"`);
        }
        // } else if (ast instanceof ArrayPattern) {

    } else if (node instanceof ObjectPattern) {
        return new ObjectNode(node.entries.map(([name]) => name));
    } else if (node instanceof Literal) {
        if (node.value === null) {
            return null;
        }
        if (typeof node.value === 'string') {
            return new ValueNode(`"${node.value}"`);
        }

        // boolean, number
        return new ValueNode(node.value.toString());
    }

    throw new Error(`Unsupported ast entry: "${node.type}"`);
};

const _deserializeGraph = (root: Expression, nodes: Node[], edges: [Node, Node, number][], variables: Variable[]): Node | null => {
    const node = deserializeNode(root, variables);
    if (node === null) {
        return null;
    }

    nodes.push(node);

    root.children().forEach((child, i) => {
        const childNode = _deserializeGraph(child, nodes, edges, variables);

        if (childNode) {
            edges.push([node, childNode, i]);
        }
    });

    return node;
};

export const deserializeGraph = (ast: Expression, variables: Variable[]) => {
    const nodes: Node[] = [];
    const edges: [Node, Node, number][] = [];
    const root = _deserializeGraph(ast, nodes, edges, variables);

    return {
        nodes,
        edges,
        root,
    };
};
