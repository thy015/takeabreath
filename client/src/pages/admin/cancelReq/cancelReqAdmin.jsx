import React, { useCallback } from "react";
import { Spin, Alert } from "antd";
import { useGet } from "../../../hooks/hooks";
import TableComponent from "../Table";

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

  // New API call for customers
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
    <div>
      <TableComponent
        header="Processing"
        columns={columns}
        data={processingDataFormatted}
        isReq={true}
        refreshData={refreshData}
      />
      <TableComponent
        header="Accepted"
        columns={columnss}
        data={acceptedDataFormatted}
      />
      <TableComponent
        header="Rejected"
        columns={columnsss}
        data={rejectedDataFormatted}
      />
    </div>
  );
};

export default cancelReqAdmin;
