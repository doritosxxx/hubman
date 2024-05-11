import { createRoot } from 'react-dom/client';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ClassicFlow, ConnectionPlugin } from 'rete-connection-plugin';
import { ReactPlugin, Presets, ReactArea2D } from 'rete-react-plugin';
import { ContextMenuExtra } from 'rete-context-menu-plugin';
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin';

import { contextMenu } from './contextMenu';
import { addBackground } from './background';

import { Schemes, Variable, nodes } from './nodes';
import { sockets } from './sockets';
import { SelectControl } from './controls';

import { GraphNode } from './components/GraphNode';
import { Socket } from './components/Socket';
import { SelectControlView } from './components/Control';
import { Expression } from '../lib/jsonlogic/ast';

import { deserializeGraph } from './deserialize';
import { serializeGraph } from './serialize';
import { withDebounce } from '../lib/helpers/withDebounce';

type AreaExtra = ReactArea2D<Schemes> | ContextMenuExtra;

export interface EditorParams {
    variables: Variable[];
    jsonlogic?: Expression;
    // jsonlogic object
    onSave: (jsonlogic: any) => void;
}

export async function createEditor(container: HTMLElement, params: EditorParams) {
    const editor = new NodeEditor<Schemes>();
    const area = new AreaPlugin<Schemes, AreaExtra>(container);

    const connection = new ConnectionPlugin<Schemes, AreaExtra>();
    connection.addPreset(() => new ClassicFlow());

    const arrange = new AutoArrangePlugin<Schemes>();
    arrange.addPreset(ArrangePresets.classic.setup());

    const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });
    render.addPreset(Presets.contextMenu.setup());
    render.addPreset(Presets.classic.setup({
        customize: {
            control(data) {
                if (data.payload instanceof SelectControl) {
                    return SelectControlView as any;
                }
                if (data.payload instanceof ClassicPreset.InputControl) {
                    return Presets.classic.Control as any;
                }

                return null;
            },
            socket(data) {
                if (sockets.some(socket => data.payload instanceof socket)) {
                    return Socket;
                }

                return Presets.classic.Socket;
            },
            node(data) {
                if (nodes.some(node => data.payload instanceof node)) {
                    return GraphNode as any;
                }

                return Presets.classic.Node;
            },
        },
    }));

    editor.use(area);
    area.use(connection);
    area.use(contextMenu({
        variables: params.variables,
    }));
    area.use(render);
    area.use(arrange);

    addBackground(area);

    const onSave = withDebounce(() => {
        const nodes = editor.getNodes();
        const connections = editor.getConnections();

        let root = nodes.find(node => node.isRoot) ?? null;
        if (!root && nodes.length) {
            nodes[0].isRoot = true;
            root = nodes[0];
        }

        const serialized = serializeGraph(root, nodes, connections);

        params.onSave(serialized);
    }, 400);

    area.addPipe((context) => {
        if (
            context.type === 'nodecreated' ||
            context.type === 'noderemoved' ||
            context.type === 'connectioncreated' ||
            context.type === 'connectionremoved'
        ) {
            onSave();
        }
        return context;
    });

    AreaExtensions.simpleNodesOrder(area);

    if (params.jsonlogic) {
        const traversal = deserializeGraph(params.jsonlogic, params.variables);

        if (traversal.root) {
            traversal.root.isRoot = true;
        }

        await Promise.all(traversal.nodes.map((node) => editor.addNode(node)));

        await Promise.all(traversal.edges.map(([parent, child, index]) => {
            return editor.addConnection(new ClassicPreset.Connection(
                parent,
                Object.keys(parent.outputs)[index],
                child,
                Object.keys(child.inputs)[0],
            ));
        }));
    }

    const fitToScreen = () => AreaExtensions.zoomAt(area, editor.getNodes());

    await arrange.layout();
    await fitToScreen();

    return {
        destroy: () => area.destroy(),
        fitToScreen,
    };
}
