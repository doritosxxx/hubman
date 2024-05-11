import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';

import { parse } from '../../../../lib/jsonlogic/jsonparser';

export const jsonlogicParseLinter = () => {
    return (view: EditorView): Diagnostic[] => {
        const code = view.state.doc.toString();
        let json: any;

        try {
            json = JSON.parse(code);
        }
        catch {
            return [];
        }

        try {
            parse(json);

            return [];
        } catch (error) {
            if (error instanceof Error) {
                return [{
                    from: 0,
                    to: 0,
                    message: error.message,
                    severity: 'error',
                    source: 'JSONLogic',
                }];
            }
            return [];
        }
    };
};
