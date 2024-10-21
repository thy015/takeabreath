import React, { useCallback } from "react";
import { Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";
import {InfoCircleOutlined } from '@ant-design/icons';
const cancelReqAdmin = () => {
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

  const formatData = (data) =>
    data.map((customer) => ({
      ...customer,
      dayReq: new Date(customer.dayReq).toLocaleDateString(),
      cusName: customerMap[customer.cusID] || 'Unknown',
    }));

  const formatDataa = (data) =>
    data.map((customer) => ({
      ...customer,
      dayReq: new Date(customer.dayReq).toLocaleDateString(),
      dayAcp: new Date(customer.dayAcp).toLocaleDateString(),
      cusName: customerMap[customer.cusID] || 'Unknown',
    }));

  const processingDataFormatted = formatData(processingData || []);
  const acceptedDataFormatted = formatDataa(acceptedData || []);
  const rejectedDataFormatted = formatDataa(rejectedData || []);

  const columns = [
    { title: "Day Request", key: "dayReq" },
    { title: "Customer Name", key: "cusName" },
    { title: "Invoice ID", key: "invoiceID" },
    { title: "Status", key: "isAccept" },
  ];

  const columnss = [
    { title: "Day Request", key: "dayReq" },
    { title: "Customer Name", key: "cusName" },
    { title: "Invoice ID", key: "invoiceID" },
    { title: "Status", key: "isAccept" },
    { title: "Admin ID", key: "adminID" },
    { title: "Day Accepted", key: "dayAcp" },
  ];

  const columnsss = [
    { title: "Day Request", key: "dayReq" },
    { title: "Customer Name", key: "cusName" },
    { title: "Invoice ID", key: "invoiceID" },
    { title: "Status", key: "isAccept" },
    { title: "Admin ID", key: "adminID" },
    { title: "Day Rejected", key: "dayAcp" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 bg-white mt-0.5">
    <div className="p-4 ">
      <h3 className="font-semibold mb-2 bg-white">ĐANG CHỜ: 3</h3>
      <div className="p-3 border rounded-lg mb-2 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024</span>
          <InfoCircleOutlined />
        </div>
        
        <div className="flex justify-between mt-2">
        <span>ID-01</span>
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-2 py-1 rounded">Đồng ý</button>
          <button className="bg-red-500 text-white px-2 py-1 rounded">Từ chối</button>
          </div>
        </div>
      </div>
      <div className="p-3 border rounded-lg mb-2 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024</span>
          <InfoCircleOutlined />
        </div>
        
        <div className="flex justify-between mt-2">
        <span>ID-01</span>
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-2 py-1 rounded">Đồng ý</button>
          <button className="bg-red-500 text-white px-2 py-1 rounded">Từ chối</button>
          </div>
        </div>
      </div>
      <div className="p-3 border rounded-lg mb-2 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024</span>
          <InfoCircleOutlined />
        </div>
        
        <div className="flex justify-between mt-2">
        <span>ID-01</span>
        <div className="flex gap-2">
          <button className="bg-green-500 text-white px-2 py-1 rounded">Đồng ý</button>
          <button className="bg-red-500 text-white px-2 py-1 rounded">Từ chối</button>
          </div>
        </div>
      </div>
    </div>

    <div className="p-4 bg-white">
      <h3 className="font-semibold mb-2">ĐÃ TỪ CHỐI: 2</h3>
      <div className="p-3 border rounded-lg mb-2 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024 - 1/10/2024</span>
        </div>
        <div className="flex items-center mt-2 justify-between">
          <div>
          <span className="text-red-500">ID-01</span>
          <span className="ml-2 bg-blue-500 text-white rounded-full px-2">LB</span>
          </div>
          <InfoCircleOutlined />
        </div>
      </div>
      <div className="p-3 border rounded-lg mb-2 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024 - 1/10/2024</span>
        </div>
        <div className="flex items-center mt-2 justify-between">
          <div>
          <span className="text-red-500">ID-01</span>
          <span className="ml-2 bg-blue-500 text-white rounded-full px-2">LB</span>
          </div>
          <InfoCircleOutlined />
        </div>
      </div>
    </div>

    <div className="p-4 bg-white">
      <h3 className="font-semibold mb-2">ĐÃ ĐỒNG Ý: 1</h3>

      <div className="p-3 border rounded-lg mb-4 bg-white">
        <div className="flex justify-between">
          <span>29/09/2024 - 1/10/2024</span>
          
        </div>
        <div className="flex items-center mt-2 justify-between">
          <div>
          <span className="text-green-500">ID-01</span>
          <span className="ml-2 bg-purple-500 text-white rounded-full px-2">LB</span>
          </div>
          <InfoCircleOutlined />
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default cancelReqAdmin;
