import React from 'react'
import { Table } from 'antd';
function TableVoucher({ component, columns, data }) {
    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <Table
            components={component}
            columns={columns}
            dataSource={data}
            bordered
            scroll={{
                x:"max-content"
              }}
            pagination={{
                pageSize: 20,
                
            }} />
    )
}

export default TableVoucher