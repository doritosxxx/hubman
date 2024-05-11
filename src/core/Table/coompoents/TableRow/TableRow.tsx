import React from 'react';

import './style.css';

interface TableRowProps {
    data: (string | React.ReactElement)[];
}

export const TableRow: React.FC<TableRowProps> = ({ data }) => {
    const cells = data.map((cell, index) => (
        <div key={index} className='table-row__cell'>
            {cell}
        </div>
    ));

    return (
        <div className='table-row__container'>
            {cells}
        </div>
    );
};
