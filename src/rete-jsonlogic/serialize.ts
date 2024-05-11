import {
    Node,
    IfNode,
    ObjectNode,
    ValueNode,
    VarNode,
    BinaryOperator,
    AllowedConnection,
    UnaryOperator,
    FunctionCallNode,
} from './nodes';

type NodeId = string;
type Edges = Map<NodeId, AllowedConnection[]>;
type NodeById = Record<NodeId, Node>;

const serializeChild = (node: Node, name: string, nodes: NodeById, edges: Edges) => {
    const children = edges.get(node.id);
    if (!children) {
        return null;
    }

    const edge = children.find(child => child.sourceOutput === name);
    if (!edge) {
        return null;
    }

    return serializeGraphToJson(nodes[edge.target] ?? null, nodes, edges);
};

const serializeGraphToJson = (node: Node | null, nodes: NodeById, edges: Edges): any => {
    if (node === null) {
        return null;
    }

    if (node instanceof BinaryOperator) {
        return {
            [node.operator.toLowerCase()]: [
                serializeChild(node, 'left', nodes, edges),
                serializeChild(node, 'right', nodes, edges),
            ],
        };
    }
    if (node instanceof UnaryOperator) {
        return {
            // Use shortcut without array.
            [node.operator]: serializeChild(node, 'arg', nodes, edges),
        };
    }
    if (node instanceof FunctionCallNode) {
        return {
            [node.name]: Object
                .keys(node.outputs)
                .map(arg => serializeChild(node, arg, nodes, edges)),
        };
    }
    if (node instanceof IfNode) {
        return {
            'if': [
                serializeChild(node, 'condition', nodes, edges),
                serializeChild(node, 'true', nodes, edges),
                serializeChild(node, 'false', nodes, edges),
            ],
        };
    }
    if (node instanceof VarNode) {
        return {
            // Use shortcut without array.
            'var': node.current ?? null,
        };
    }
    if (node instanceof ObjectNode) {
        return Object.fromEntries(Object
            .keys(node.outputs)
            .map(key => [key, serializeChild(node, key, nodes, edges)]),
        );
    }
    if (node instanceof ValueNode) {
        // Insert as is.
        try {
            return JSON.parse(node.value);
        } catch {
            return null;
        }
    }

    throw new Error(`Unable to serialize unsupported node type: "${node.label}"`);
};

/**
 * @note Should actually serialize the graph into AST.
 * @returns Jsonlogic javascript object representation.
 */
export const serializeGraph = (
    root: Node | null,
    nodes: Node[],
    connections: AllowedConnection[],
): any => {
    const edges: Edges = new Map();

    for (const connection of connections) {
        if (!edges.has(connection.source)) {
            edges.set(connection.source, []);
        }

        edges.get(connection.source)?.push(connection);
    }

    return serializeGraphToJson(
        root,
        Object.fromEntries(nodes.map(node => [node.id, node])),
        edges,
    );
}; 
