import React from 'react';

import { ExpandableView } from '../../../../forms/RuleForm/components/ExpandableView/ExpandableView';
import { GraphEditor } from '../../../../forms/RuleForm/components/GraphEditor/GraphEditor';
import { CodeEditorField } from '../CodeEditorField/CodeEditorField';

import './style.css';
import { Label } from '../Label/Label';
import { Variable } from '../../../../rete-jsonlogic/nodes';
import { useInstance } from '../../../../lib/react/useInstance';
import { createSignal } from '../../../../lib/signal';
import { Expression } from '../../../../lib/jsonlogic/ast';

interface RuleEditorProps {
    graphViewEnabled: boolean;
    label?: string;
    value: string;
    onChange?: (value: string) => void;

    inputVariables: Variable[] | undefined;
    defaultTree?: Expression;
}

export const RuleEditor: React.FC<RuleEditorProps> = ({
    graphViewEnabled,
    label,
    value,
    inputVariables,
    defaultTree,
    onChange,
}) => {
    const animationStartSignal = useInstance(createSignal);
    const animationEndSignal = useInstance(createSignal);
    const fitToScreenSignal = useInstance(createSignal);

    React.useEffect(() => {
        let frame: number | undefined;

        const scheduleFitToScreen = () => {
            frame = requestAnimationFrame(() => {
                fitToScreenSignal.emit();
                scheduleFitToScreen();
            });
        };

        const cancelFitToScreen = () => {
            if (frame === undefined) {
                return;
            }

            cancelAnimationFrame(frame);
            frame = undefined;
        };

        const unlistenAnimationStart = animationStartSignal.listen(() => {
            cancelFitToScreen();
            scheduleFitToScreen();
        });

        const unlistenAnimationEnd = animationEndSignal.listen(cancelFitToScreen);

        return () => {
            unlistenAnimationStart();
            unlistenAnimationEnd();
            cancelFitToScreen();
        };
    }, []);

    return (
        <Label label={label || ''}>
            <div className='rule-editor__root'>
                {graphViewEnabled ? (
                    <ExpandableView
                        onAnimationStart={animationStartSignal.emit}
                        onAnimationEnd={animationEndSignal.emit}
                    >
                        <GraphEditor
                            variables={inputVariables}
                            jsonlogic={value}
                            defaultTree={defaultTree}
                            onSave={onChange}
                            listenFitToScreen={fitToScreenSignal.listen}
                        />
                    </ExpandableView>
                ) : (
                    <CodeEditorField
                        mode="jsonlogic"
                        value={value}
                        onChange={onChange}
                    />
                )}
            </div>
        </Label>
    );
};
