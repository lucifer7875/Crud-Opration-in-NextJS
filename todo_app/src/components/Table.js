import React from 'react';
import DataTable from 'react-data-table-component';

const Table = ({ title, columns, data, onSort }) => {
    return (
        <DataTable
            title={title}
            columns={columns}
            data={data}
            onSort={onSort}
            pagination
            sortServer
        />
    );
};

export default Table;
