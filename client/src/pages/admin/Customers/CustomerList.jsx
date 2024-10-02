import React from "react";
import { Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";
import TableComponent from "../Table"; 

const CustomersList = () => {
  const { data, error, loading } = useGet("http://localhost:4000/api/auth/customer");

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load customers."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No customer data found" type="info" showIcon />;
  }

  const columns = [
    { title: "Name", key: "cusName" },
    { title: "Email", key: "email" },
    { title: "Phone Number", key: "phoneNum" },
    { title: "Birthday", key: "birthday" }
  ];


  const formattedData = data.map(customer => ({
    ...customer,
    birthday: new Date(customer.birthday).toLocaleDateString() 
  }));

  return (
    <TableComponent
      header="Customer List"
      columns={columns}
      data={formattedData}
    />
  );
};

export default CustomersList;
