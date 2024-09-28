
import React, { useState } from "react";
import { Row, Col, Checkbox, Collapse, Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";

const CustomersList = () => {
    const { data, error, loading } = useGet(
        "http://localhost:4000/api/auth/customer"
      );
      if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
      }
    
      if (error) {
        return (
          <Alert
            message="Error"
            description="Failed to load properties."
            type="error"
            showIcon
          />
        );
      }
    
      if (!data || data.length === 0) {
        return <Alert message="No hotel data found" type="info" showIcon />;
      }
      console.log(data);
  return (
    <div className="container mx-auto mt-2">
    <table className="min-w-full bg-white border ">
      <thead>
        <tr className="bg-white-200">
          <th className="py-2 px-4 border-b border-white-300">Name</th>
          <th className="py-2 px-4 border-b border-white-300">Email</th>
          <th className="py-2 px-4 border-b border-white-300">Phone Number</th>
          <th className="py-2 px-4 border-b border-white-300">Birthday</th>
        </tr>
      </thead>
      <tbody>
        {data.map((data) => (
          <tr key={data._id} className="hover:bg-white-100">
            <td className="py-2 px-4 border-b border-white-300">{data.cusName}</td>
            <td className="py-2 px-4 border-b border-white-300">{data.email}</td>
            <td className="py-2 px-4 border-b border-white-300">{data.phoneNum}</td>
            <td className="py-2 px-4 border-b border-white-300">
              {new Date(data.birthday).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default CustomersList