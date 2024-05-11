import React from 'react';
import { useRete } from 'rete-react-plugin';
import { EditorParams, createEditor } from '../../../../rete-jsonlogic/editor';
import { Variable } from '../../../../rete-jsonlogic/nodes';
import { parse } from '../../../../lib/jsonlogic/jsonparser';
import { Expression } from '../../../../lib/jsonlogic/ast';

import './style.css';

interface ReteProps {
    params: EditorParams;
    listenFitToScreen?: (listener: VoidFunction) => VoidFunction;
}

const Rete: React.FC<ReteProps> = ({
    params,
    listenFitToScreen,
}) => {
    const [ref, controller] = useReteInstance(createEditor, params);

    React.useEffect(() => {
        if (!listenFitToScreen || !controller) {
            return;
        }

        const unlisten = listenFitToScreen(controller.fitToScreen);
        return unlisten;
    }, [listenFitToScreen, controller?.fitToScreen]);

    return (
        <div ref={ref} className='graph-editor__root' />
    );
};


function useReteInstance<T extends {
    destroy(): void;
}, E>(create: (el: HTMLElement, options: E) => Promise<T>, options: E): ReturnType<typeof useRete<T>> {
    const factory = React.useCallback(
        (el: HTMLElement) => create(el, options),
        [create, options],
    );

    return useRete(factory);
}

interface GraphEditorProps {
    variables: Variable[] | undefined;
    jsonlogic?: string;
    defaultTree?: Expression;
    onSave?: (json: string) => void;
    listenFitToScreen?: (listener: VoidFunction) => VoidFunction;
}

/**
 * Uncontrolled component that captures initial editor data.
 */
export const GraphEditor: React.FC<GraphEditorProps> = ({
    variables,
    jsonlogic,
    defaultTree,
    onSave,
    listenFitToScreen,
}) => {
    const [params, setParams] = React.useState<EditorParams | undefined>(undefined);


    React.useEffect(() => {
        if (params) {
            return;
        }
        // Wait for variables to load.
        if (!variables) {
            return;
        }

        let ast: Expression | undefined;

        if (!jsonlogic) {
            ast = defaultTree;
        } else {
            try {
                ast = parse(JSON.parse(jsonlogic));
            }
            catch {
                ast = defaultTree;
            }
        }


        setParams({
            variables,
            jsonlogic: ast,
            onSave(jsonlogic) {
                onSave?.(JSON.stringify(jsonlogic, null, 4));
            },
        });
    });

    if (!params) {
        return null;
    }

    return (
        <Rete params={params} listenFitToScreen={listenFitToScreen} />
    );
};
