import React from 'react';

import { Table } from '../Table/Table';
import { AddButton } from './components/AddButton/AddButton';
import { ActionsCell } from './components/ActionsCell/ActionsCell';

interface CRUDTableProps<D> {
    headers: string[];
    data: D[];
    getRow: (data: D) => (string | React.ReactElement)[];
    onCreate: () => void;
    onEdit: (data: D) => void;
    onDelete: (data: D) => void;
}

export function CRUDTable<D>(props: CRUDTableProps<D>) {
    const { data, getRow } = props;

    const headers = React.useMemo(() => [...props.headers, 'Actions'], [props.headers]);

    const rows = React.useMemo(() => data.map(item => {
        const row = getRow(item);

        row.push(
            <ActionsCell
                onEdit={() => props.onEdit(item)}
                onDelete={() => props.onDelete(item)}
            />,
        );

        return row;
    }), [getRow, data]);

    return (
        <>
            <Table
                headers={headers}
                rows={rows}
            />
            <AddButton onClick={props.onCreate} />
        </>
    );
}
