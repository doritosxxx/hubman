import { BaseSchemes, GetSchemes, NodeEditor } from 'rete';
import { BaseAreaPlugin } from 'rete-area-plugin';
import { ContextMenuPlugin } from 'rete-context-menu-plugin';

type Item = {
    label: string
    key: string
    handler(): void
    subitems?: Item[]
}

type ItemsCollection = {
    searchBar?: boolean,
    list: Item[]
}

type Items<Schemes extends BaseSchemes> = (
    context: 'root' | Schemes['Node'],
    plugin: ContextMenuPlugin<Schemes>
) => ItemsCollection

type BSchemes = GetSchemes<
    BaseSchemes['Node'] & { clone?: () => BaseSchemes['Node'] },
    BaseSchemes['Connection']
>
type NodeFactory<Schemes extends BSchemes> = () => Schemes['Node'] | Promise<Schemes['Node']>

type ItemDefinition<Schemes extends BSchemes> =
    | [string, NodeFactory<Schemes> | ItemDefinition<Schemes>[]]

function createItem<S extends BSchemes>(
    [label, factory]: ItemDefinition<S>,
    key: string | number,
    context: { editor: NodeEditor<S>, area: BaseAreaPlugin<S, any> },
): Item {
    const item = {
        label,
        key: String(key),
    };

    if (typeof factory === 'function') {
        return <Item>{
            ...item,
            async handler() {
                const node = await factory();
                if (context.editor.getNodes().length === 0) {
                    (node as any).isRoot = true;
                }

                await context.editor.addNode(node);

                context.area.translate(node.id, context.area.area.pointer);
            },
        };
    }
    return <Item>{
        ...item,
        handler() {/* do nothing */ },
        subitems: factory.map((data, i) => createItem(data, i, context)),
    };
}

export function setup<Schemes extends BSchemes>(nodes: ItemDefinition<Schemes>[]) {
    return <Items<Schemes>>(function (context, plugin) {
        const area = plugin.parentScope<BaseAreaPlugin<Schemes, any>>(BaseAreaPlugin);
        const editor = area.parentScope<NodeEditor<Schemes>>(NodeEditor);

        if (context === 'root') {
            return {
                searchBar: true,
                list: nodes.map((item, i) => createItem(item, i, { editor, area })),
            };
        }

        const deleteItem: Item = {
            label: 'Delete',
            key: 'delete',
            async handler() {
                const nodeId = context.id;
                const node = editor.getNode(nodeId) as any;

                const connections = editor.getConnections().filter(c => {
                    return c.source === nodeId || c.target === nodeId;
                });

                for (const connection of connections) {
                    await editor.removeConnection(connection.id);
                }
                await editor.removeNode(nodeId);

                if (node.isRoot) {
                    const first = editor.getNodes()[0] as any;
                    if (first) {
                        first.isRoot = true;
                        area.update('node', first.id);
                    }
                }
            },
        };

        const setRootItem: Item = {
            label: 'Set root',
            key: 'root',
            async handler() {
                const nodeId = context.id;

                const nodes = editor.getNodes() as any[];
                const previousRoots = nodes.filter(node => node?.isRoot);
                for (const node of previousRoots) {
                    node.isRoot = false;
                    area.update('node', node.id);
                }

                const rootNode = nodes.find(node => node.id === nodeId);
                rootNode.isRoot = true;
                area.update('node', nodeId);
            },
        };

        const clone = context.clone;
        const cloneItem: undefined | Item = clone && {
            label: 'Clone',
            key: 'clone',
            async handler() {
                const node = clone();

                await editor.addNode(node);

                area.translate(node.id, area.area.pointer);
            },
        };

        return {
            searchBar: false,
            list: [
                deleteItem,
                setRootItem,
                ...(cloneItem ? [cloneItem] : []),
            ],
        };
    });
}
