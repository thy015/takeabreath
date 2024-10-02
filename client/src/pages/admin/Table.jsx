import React from "react";
import axios from "axios";
import { notification } from "antd"; 

const TableComponent = ({ header, columns, data, isReq = false, refreshData }) => {
  const handleAccept = async (row) => {
  
    try {
      const response = await axios.post(`http://localhost:4000/api/cancelReq/admin/accept/${row._id}`);
      if (response.data.status === 'OK') {
        notification.success({
          message: 'Request Accepted',
          description: 'The request has been accepted successfully!',
        });
        refreshData(); 
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to accept the request.',
        });
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Request Acceptance Failed',
        description: errorMessage,
      });
    }
  };

  const handleReject = async (row) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/cancelReq/admin/reject/${row._id}`);
      console.log("Reject response:", response); 
      
      if (response.data.status === 'OK') {
        notification.success({
          message: 'Request Rejected',
          description: 'The request has been rejected successfully!',
        });
        refreshData(); 
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to reject the request.',
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Request Rejection Failed',
        description: errorMessage,
      });
    }
  };
  

  return (
    <div className="container mx-auto mt-2">
      {header && <h1>{header}</h1>}
      <table className="min-w-full bg-cyan border">
        <thead>
          <tr className="bg-white-200">
            {columns.map((col, index) => (
              <th key={index} className="py-2 px-4 border-b border-white-300">
                {col.title}
              </th>
            ))}
            {isReq && (
              <th className="py-2 px-4 border-b border-white-300">Action</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-white-100">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="py-2 px-4 border-b border-white-300">
                  {row[col.key]}
                </td>
              ))}
              {isReq && (
                <td className="py-2 px-4 border-b border-white-300">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 mr-2 rounded"
                    onClick={() => handleAccept(row)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                    onClick={() => handleReject(row)}
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
