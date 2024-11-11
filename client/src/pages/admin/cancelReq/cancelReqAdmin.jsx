import React, { useCallback, useEffect, useState,useContext } from "react";
import { Spin, Alert,Button, notification,Modal } from "antd";
import { useGet } from "../../../hooks/hooks";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ModalDelete,ModalActivate } from "../Customers/CustomerList";
import { AuthContext } from "../../../hooks/auth.context";
import axios from 'axios'
const cancelReqAdmin = () => {
  axios.defaults.withCredentials = true
  const {auth,setAuth} = useContext(AuthContext)
  const [cusID,setCusID]=useState();
  const [reason, setReason] = useState("");
  const[isProcess,setIsProcess]=useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const [cancelDetailModalVisible, setcancelDetailModalVisible] = useState(false); 
  const [selectedCancel, setselectedCancel] = useState(null); 
  const [refresh, setRefresh] = useState(false);
    const getName = (name) => {
      return name
        .split(' ')             
        .map((word) => word[0])   
        .join('')                
        .toUpperCase();         
    };
  const handleAccept=async(req,res)=>{
try {
  const response=await axios.post(`http://localhost:4000/api/cancelReq/accept/${cusID}`,{adminID:auth.user.id},  { withCredentials: true })
  if (response.data.success) {
    notification.success({
        message: 'Chấp Nhận Yêu Cầu Thành Công',
        description: 'Yêu cầu của khách hàng đã được chấp nhận!',
    });
    setRefresh(prev => !prev); 
    setActivateModalVisible(false);
} else {
    notification.error({
        message: 'Chấp Nhận Yêu Cầu Thất Bại',
        description: 'Yêu cầu của khách hàng chưa được chấp nhận!',
    });
}
} catch (error) {
  const errorMessage = error.response?.data?.message || "An unknown error occurred.";
  notification.error({
      message: 'Customer Activation Failed',
      description: errorMessage,
  });
}
  }
  const handleConfirm=async(req,res)=>{
    try {
      const response=await axios.post(`http://localhost:4000/api/cancelReq/reject/${cusID}`,{adminID:auth.user.id,rejectedReason:reason},  { withCredentials: true })
      if (response.data.success) {
        notification.success({
            message: 'Từ Chối Yêu Cầu Thành Công',
            description: 'Yêu cầu của khách hàng đã bị từ chối!',
        });
        handleDeleteCancel();
        setRefresh(prev => !prev); 
    } else {
        notification.error({
            message: 'Từ Chối Yêu Cầu Thất Bại',
            description: 'Yêu cầu của khách hàng chưa được từ chối!',
        });
    }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
          message: 'Customer Activation Failed',
          description: errorMessage,
      });
    }
      }
  const {
    data: processingData,
    error: processingError,
    loading: processingLoading,
    refetch: refetchProcessingData,
  } = useGet("http://localhost:4000/api/cancelReq/processing",refresh);

  const {
    data: acceptedData,
    error: acceptedError,
    loading: acceptedLoading,
    refetch: refetchAcceptedData,
  } = useGet("http://localhost:4000/api/cancelReq/accepted",refresh);
  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setCusID(null);
    setReason(""); 
  };

  const {
    data: rejectedData,
    error: rejectedError,
    loading: rejectedLoading,
    refetch: refetchRejectedData,
  } = useGet("http://localhost:4000/api/cancelReq/rejected",refresh);
  const handleInfoClick = (orderID) => {
    const cancelDetails = acceptedDataFormatted.find(item => item._id === orderID)||rejectedDataFormatted.find(item => item._id === orderID)||processingDataFormatted.find(item => item._id === orderID); 
    setselectedCancel(cancelDetails);
    setcancelDetailModalVisible(true); 
  };

  const handleModalClose = () => {
    setcancelDetailModalVisible(false); 
    setIsProcess(false)
  };

  const formatToVND = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };
  const {
    data: customerData,
    error: customerError,
    loading: customerLoading,
  } = useGet("http://localhost:4000/api/auth/customer");

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
            <span>Ngày yêu cầu: {item.dayReq}</span>
            <InfoCircleOutlined className="text-yellow-600" onClick={() => {handleInfoClick(item._id),setIsProcess(true)}}/>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <span className="text-yellow-600">ID: {item._id.slice(-6)}</span>
            <div className="flex gap-2">
        <button onClick={()=>{setActivateModalVisible(true),setCusID(item._id)}} className="bg-green-500 text-white px-2 rounded hover:bg-green-400  ">
  Đồng ý
</button>

              <button onClick={()=>{setDeleteModalVisible(true),setCusID(item._id)}} className="bg-red-600 text-white px-2 py-1 hover:bg-red-400 rounded">Từ chối</button>
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
            <span>Ngày yêu cầu: {item.dayReq}</span>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <div>
              <span className="text-red-500">ID: {item._id.slice(-6)}</span>
              <span className="ml-2 bg-[#be6785] text-white rounded-full px-2">{getName(item.adminID.adminName)}</span>
            </div>
            <InfoCircleOutlined className="text-red-700" onClick={() => handleInfoClick(item._id)}/>
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
            <span>Ngày yêu cầu: {item.dayReq}</span>
          </div>
          <div className="flex items-center mt-2 justify-between">
            <div>
              <span className="text-green-500">ID: {item._id.slice(-6)}</span>
              <span className="ml-2 bg-[#663000] text-white rounded-full px-2">{getName(item.adminID.adminName)}</span>
            </div>
            <InfoCircleOutlined className="text-green-700" onClick={() => handleInfoClick(item._id)} />
          </div>
        </div>
      ))}
    </div>
    <ModalDelete
        open={deleteModalVisible}
        onClose={handleDeleteCancel}
        reason={reason}
        onConfirm={handleConfirm}
        setReason={setReason}
        header={"từ chối yêu cầu"}
      />
      <ModalActivate
        open={activateModalVisible}
        onClose={() => setActivateModalVisible(false)}
        onConfirm={handleAccept}
        header={"Chấp nhận yêu cầu"}
      />
          <Modal
        title={<div className="text-center font-bold text-lg">Chi Tiết Hóa Đơn</div>}
        visible={cancelDetailModalVisible}
        onCancel={handleModalClose}
        footer={null}
        isProcess={isProcess}
      >
        {selectedCancel && (
          <div className="p-5">
            <div className="mb-4">
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Khách Hàng:</strong> {selectedCancel.invoiceID.guestInfo.name}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Email:</strong> {selectedCancel.invoiceID.guestInfo.email}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Số điện thoại:</strong> {selectedCancel.invoiceID.guestInfo.phone}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Ngày Tạo:</strong> {new Date(selectedCancel.dayReq).toLocaleString('vi-VN')}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Tổng Tiền:</strong> {formatToVND(selectedCancel.refundAmount)}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Phương thức thanh toán:</strong> {selectedCancel.invoiceID.guestInfo.paymentMethod || 'Chưa có thông tin'}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Trạng Thái:</strong> {selectedCancel.isAccept === 'accepted' ? 'Đã chấp nhận' : selectedCancel.isAccept === 'processing'?'Chờ xử lý':'Đã từ chối'}
              </p>
              {isProcess === false && selectedCancel?.adminID && (
  <>
    <p className="flex items-center mb-1">
      <strong className="w-[100px]">Admin xử lý:</strong> {selectedCancel.adminID.adminName || 'Không có'}
    </p>
    <p className="flex items-center mb-1">
      <strong className="w-[100px]">Lý do từ chối:</strong> {selectedCancel.rejectedReason || 'Không có'}
    </p>
  </>
)}
            </div>
            <div className="border-t border-gray-200 pt-4">
              {/* <p className="mb-2"><strong>Thông tin Hóa Đơn:</strong></p> */}
              <div>
                <p className="mb-1"><strong>Ngày nhận phòng:</strong> {new Date(selectedCancel.invoiceID.guestInfo.checkInDay).toLocaleDateString('vi-VN')}</p>
                <p className="mb-1"><strong>Ngày trả phòng:</strong> {new Date(selectedCancel.invoiceID.guestInfo.checkOutDay).toLocaleDateString('vi-VN')}</p>
                <p className="mb-1"><strong>Chứng minh nhân dân:</strong> {selectedCancel.invoiceID.guestInfo.idenCard}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
  </div>
  
  );
};

export default cancelReqAdmin;
