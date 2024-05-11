import React from 'react';

import './style.css';

import { TableRow } from './coompoents/TableRow/TableRow';

export interface TableProps {
    headers: string[];
    rows: (string | React.ReactElement)[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => {
    return (
        <div className='table__root'>
            <div className='table__headers text--header'>
                <TableRow data={headers} />
            </div>
            <div className='table__rows text--input__title'>
                {rows.map((row, index) => (
                    <TableRow key={index} data={row} />
                ))}
            </div>
        </div>
    );
};
