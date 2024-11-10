import React, { useCallback } from "react";
import { Spin, Alert,Button } from "antd";
import { useGet } from "../../../hooks/hooks";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ModalDelete } from "../Customers/CustomerList";
import axios from 'axios'
const cancelReqAdmin = () => {
    const getName = (name) => {
      return name
        .split(' ')             
        .map((word) => word[0])   
        .join('')                
        .toUpperCase();         
    };
  const handleAccept=async(req,res)=>{
try {
  
} catch (error) {
  
}
  }
  const {
    data: processingData,
    error: processingError,
    loading: processingLoading,
    refetch: refetchProcessingData,
  } = useGet("http://localhost:4000/api/cancelReq/processing");

  const {
    data: acceptedData,
    error: acceptedError,
    loading: acceptedLoading,
    refetch: refetchAcceptedData,
  } = useGet("http://localhost:4000/api/cancelReq/accepted");

  const {
    data: rejectedData,
    error: rejectedError,
    loading: rejectedLoading,
    refetch: refetchRejectedData,
  } = useGet("http://localhost:4000/api/cancelReq/rejected");

  const {
    data: customerData,
    error: customerError,
    loading: customerLoading,
  } = useGet("http://localhost:4000/api/auth/customer");

  const refreshData = useCallback(() => {
    refetchProcessingData();
    refetchAcceptedData();
    refetchRejectedData();
  }, [refetchProcessingData, refetchAcceptedData, refetchRejectedData]);

  if (processingLoading || acceptedLoading || rejectedLoading || customerLoading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (processingError || acceptedError || rejectedError || customerError) {
    return (
      <Alert
        message="Error"
        description="Failed to load customer requests."
        type="error"
        showIcon
      />
    );
  }

  if ((!processingData || processingData.length === 0) &&
      (!acceptedData || acceptedData.length === 0) &&
      (!rejectedData || rejectedData.length === 0)) {
    return <Alert message="No customer data found" type="info" showIcon />;
  }

  const createCustomerMap = (customers) => {
    const customerMap = {};
    customers.forEach(customer => {
      customerMap[customer._id.toString()] = customer.cusName;
    });
    return customerMap;
  };

  const customerMap = createCustomerMap(customerData || []);



  const formatDataWithAcceptDate = (data) =>
    data.map((customer) => ({
      ...customer,
      dayReq: new Date(customer.dayReq).toLocaleDateString('vi-VN'),
      checkInDay: new Date(customer.invoiceID.guestInfo.checkInDay).toLocaleDateString('vi-VN'),
      checkOutDay: new Date(customer.invoiceID.guestInfo.checkOutDay).toLocaleDateString('vi-VN'),
      cusName: customerMap[customer.cusID] || 'Unknown',
    }));

  const processingDataFormatted = formatDataWithAcceptDate(processingData || []);
  const acceptedDataFormatted = formatDataWithAcceptDate(acceptedData || []);
  const rejectedDataFormatted = formatDataWithAcceptDate(rejectedData || []);

  return (
    <div className="grid grid-cols-3 gap-4 bg-[#F8F9FC] h-full mt-0.5">
    {/* yeu cau process */}
    <div className="p-4 flex flex-col overflow-y-auto">
      <h3 className="font-semibold mb-2 text-yellow-600">ĐANG CHỜ: {processingDataFormatted.length}</h3>
      {processingDataFormatted.map((item, index) => (
        <div key={index} className="p-3 border rounded-lg mb-2 bg-[#F8F9FC]">
          <div className="flex justify-between">
            <span>{item.dayReq}</span>
            <InfoCircleOutlined className="text-yellow-600"/>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <span className="text-yellow-600">{item._id.slice(-6)}</span>
            <div className="flex gap-2">
        <button className="bg-green-500 text-white px-2 rounded hover:bg-green-400  ">
  Đồng ý
</button>

              <button className="bg-red-600 text-white px-2 py-1 hover:bg-red-400 rounded">Từ chối</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  
    {/* yeu cau reject */}
    <div className="p-4 flex flex-col overflow-y-auto">
      <h3 className="font-semibold mb-2 text-red-500">ĐÃ TỪ CHỐI: {rejectedDataFormatted.length}</h3>
      {rejectedDataFormatted.map((item, index) => (
        <div key={index} className="p-3 border rounded-lg mb-2 bg-[#F8F9FC]">
          <div className="flex justify-between">
            <span>{item.dayReq}</span>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <div>
              <span className="text-red-500">{item._id.slice(-6)}</span>
              <span className="ml-2 bg-[#be6785] text-white rounded-full px-2">{getName(item.adminID.adminName)}</span>
            </div>
            <InfoCircleOutlined className="text-red-700"/>
          </div>
        </div>
      ))}
    </div>
  
    {/* yeu cau accept */}
    <div className="p-4 flex flex-col overflow-y-auto">
      <h3 className="font-semibold mb-2 text-green-500">ĐÃ ĐỒNG Ý: {acceptedDataFormatted.length}</h3>
      {acceptedDataFormatted.map((item, index) => (
        <div key={index} className="p-3 border rounded-lg mb-2 bg-[#F8F9FC]">
          <div className="flex justify-between">
            <span>{item.dayReq}</span>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <div>
              <span className="text-green-500">{item._id.slice(-6)}</span>
              <span className="ml-2 bg-[#663000] text-white rounded-full px-2">{getName(item.adminID.adminName)}</span>
            </div>
            <InfoCircleOutlined className="text-green-700"/>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default cancelReqAdmin;
