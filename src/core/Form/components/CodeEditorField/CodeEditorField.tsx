import React from 'react';

import CodeMirror, { Extension } from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { lintGutter, linter } from '@codemirror/lint';

import { jsonlogicParseLinter } from './jsonlogicParseLinter';

interface CodeEditorFieldProps {
    value: any;
    onChange?: (value: any) => void;
    mode?: 'json' | 'jsonlogic';
}

export const CodeEditorField: React.FC<CodeEditorFieldProps> = ({
    value,
    onChange,
    mode,
}) => {
    const extensions = React.useMemo(() => {
        const extensions: Extension[] = [lintGutter()];
        if (mode === 'json' || mode === 'jsonlogic') {
            extensions.push(json());
            extensions.push(linter(jsonParseLinter()));
        }

        if (mode === 'jsonlogic') {
            extensions.push();
        }

        extensions.push(linter(jsonlogicParseLinter()));

        return extensions;
    }, [mode]);

    return (
        <CodeMirror
            className='text--input__title'
            value={value}
            height="30.0rem"
            onChange={onChange}
            extensions={extensions}
        />
    );
};
