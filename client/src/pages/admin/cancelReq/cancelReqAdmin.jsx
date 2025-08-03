import React, {useState} from "react";
import {Spin, Alert, notification, Modal, DatePicker} from "antd";
import {useGet} from "@/hooks/hooks";
import {ModalDelete, ModalActivate} from "../Customers/CustomerList";
import axios from 'axios'
import moment from "moment";
import {useSelector} from "react-redux";
import {ListFilter} from "lucide-react";
import {formatMoney} from "@/utils/utils";
// TODO: Makeover page cancel req
const CancelReqAdmin = () => {
  axios.defaults.withCredentials = true
  const auth = useSelector (state => state.auth)
  const [cancelID, setCancelID] = useState ();
  const [reason, setReason] = useState ("");
  const [isProcess, setIsProcess] = useState (false);
  const [deleteModalVisible, setDeleteModalVisible] = useState (false);
  const [activateModalVisible, setActivateModalVisible] = useState (false);
  const [cancelDetailModalVisible, setcancelDetailModalVisible] = useState (false);
  const [selectedCancel, setselectedCancel] = useState (null);
  const [refresh, setRefresh] = useState (false);
  const BE_PORT = import.meta.env.VITE_BE_PORT
  const [filterDate, setFilterDate] = useState (null);
  const [filterModalVisible, setFilterModalVisible] = useState (false);
  const getName = (name) => {
    return name.split (' ').map ((word) => word[0]).join ('').toUpperCase ();
  };

  const handleAccept = async () => {
    try {
      const response = await axios.post (`${BE_PORT}/api/cancelReq/accept/${cancelID}`, {adminID: auth.id}, {withCredentials: true})
      if (response.data.success) {
        notification.success ({
          message: 'Chấp Nhận Yêu Cầu Thành Công',
          description: 'Yêu cầu của khách hàng đã được chấp nhận!',
        });
        setRefresh (prev => !prev);
        setActivateModalVisible (false);
      } else {
        notification.error ({
          message: 'Chấp Nhận Yêu Cầu Thất Bại',
          description: 'Yêu cầu của khách hàng chưa được chấp nhận!',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
      notification.error ({
        message: 'Lỗi không xác định',
        description: errorMessage,
      });
    }
  }
  const handleConfirm = async () => {
    try {
      const response = await axios.post (`${BE_PORT}/api/cancelReq/reject/${cancelID}`, {
        adminID: auth.id,
        rejectedReason: reason
      }, {withCredentials: true})
      if (response.data.success) {
        notification.success ({
          message: 'Từ Chối Yêu Cầu Thành Công',
          description: 'Yêu cầu của khách hàng đã bị từ chối!',
        });
        handleDeleteCancel ();
        setRefresh (prev => !prev);
      } else {
        notification.error ({
          message: 'Từ Chối Yêu Cầu Thất Bại',
          description: 'Yêu cầu của khách hàng chưa được từ chối!',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
      notification.error ({
        message: 'Lỗi không xác định',
        description: errorMessage,
      });
    }
  }
  const {
    data: processingData,
    error: processingError,
    loading: processingLoading,
  } = useGet (`${BE_PORT}/api/cancelReq/processing`, refresh);

  const {
    data: acceptedData,
    error: acceptedError,
    loading: acceptedLoading,
  } = useGet (`${BE_PORT}/api/cancelReq/accepted`, refresh);

  const handleDeleteCancel = () => {
    setDeleteModalVisible (false);
    setCancelID (null);
    setReason ("");
  };
  const handleFilterChange = (date, dateString) => {
    setFilterDate (dateString);
    setFilterModalVisible (false);
  };
  const {
    data: rejectedData,
    error: rejectedError,
    loading: rejectedLoading,
  } = useGet (`${BE_PORT}/api/cancelReq/rejected`, refresh);

  const handleInfoClick = (orderID) => {
    const cancelDetails = acceptedDataFormatted.find (item => item._id === orderID) || rejectedDataFormatted.find (item => item._id === orderID) || processingDataFormatted.find (item => item._id === orderID);
    setselectedCancel (cancelDetails);
    setcancelDetailModalVisible (true);
  };

  const handleModalClose = () => {
    setcancelDetailModalVisible (false);
    setIsProcess (false)
  };
  const filterByDate = (data, date) => {
    if (!date) return data;
    const filterDateFormatted = moment (date, 'DD/MM/YYYY').startOf ('day');
    return data.filter ((item) => {
      const itemDate = moment (item.dayReq, 'DD/MM/YYYY');
      return itemDate.isSame (filterDateFormatted, 'day');
    });
  };

  if (processingLoading || acceptedLoading || rejectedLoading) {
    return <Spin size="large" style={{display: "block", margin: "auto"}}/>;
  }

  if (processingError || acceptedError || rejectedError) {
    return (
      <Alert
        message="Error"
        description="Lỗi trong quá trình lấy yêu cầu khách hàng"
        type="error"
        showIcon
      />
    );
  }
  // TODO: Get rid of cancel request by admin => Only show, cancel by user
  const formatDataWithAcceptDate = (data) =>
    data?.map ((customer) => ({
      ...customer,
      dayReq: new Date (customer.dayReq).toLocaleDateString ("vi-VN"),
      checkInDay: customer.invoiceID?.guestInfo?.checkInDay
        ? new Date (customer.invoiceID.guestInfo.checkInDay).toLocaleDateString ("vi-VN")
        : "N/A",
      checkOutDay: customer.invoiceID?.guestInfo?.checkOutDay
        ? new Date (customer.invoiceID.guestInfo.checkOutDay).toLocaleDateString ("vi-VN")
        : "N/A",
    }));

  const processingDataFormatted = formatDataWithAcceptDate (processingData || []);
  const acceptedDataFormatted = formatDataWithAcceptDate (acceptedData || []);
  const rejectedDataFormatted = formatDataWithAcceptDate (rejectedData || []);
  const filteredProcessingData = filterByDate (processingDataFormatted, filterDate);
  const filteredAcceptedData = filterByDate (acceptedDataFormatted, filterDate);
  return (
    <div className="grid grid-cols-2 gap-4 bg-[#F8F9FC] h-full mt-0.5">
      {/* yeu cau process */}
      <div className="p-4 flex flex-col overflow-y-auto col-span-1 font-roboto">
        <h3 className="text-yellow-500">Đang chờ: {filteredProcessingData.length} đơn</h3>
        {filteredProcessingData.map ((item, index) => (
          <div key={index} className="p-3 border rounded-lg mb-2 bg-[#F8F9FC] cursor-pointer"
               onClick={() => handleInfoClick (item._id)}>
            <div className="flex justify-between">
              <span>Ngày yêu cầu: {item.dayReq}</span>
            </div>
            <div className="flex items-center mt-2 justify-between">
              <span className="text-yellow-600">ID: {item._id.slice (-6)}</span>
              <div className="flex gap-2">

                <button
                  onClick={(e) => {
                    e.stopPropagation (); // Prevent the parent onClick from being triggered
                    setActivateModalVisible (true);
                    setCancelID (item._id);
                  }} className="bg-green-700 text-white px-2 rounded hover:bg-green-500 h-8 ">
                  Xác nhận chuyển
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* yeu cau accept */}
      <div className="p-4 flex flex-col overflow-y-auto col-span-1 font-roboto">
        <h3 className="text-green-700">Đã chuyển: {filteredAcceptedData.length} đơn</h3>
        {filteredAcceptedData.map ((item, index) => (
          <div key={index} className="p-3 border rounded-lg mb-2 bg-[#F8F9FC] cursor-pointer"
               onClick={() => handleInfoClick (item._id)}>
            <div className="flex justify-between">
              <span>Ngày yêu cầu: {item.dayReq}</span>
            </div>
            <div className="flex items-center mt-2 justify-between">
              <div>
                <span className="text-green-500">ID: {item._id.slice (-6)}</span>
                <span
                  className="ml-2 bg-[#663000] text-white rounded-full px-2">{getName (item.adminID.adminName)}</span>
              </div>
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
        onClose={() => setActivateModalVisible (false)}
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
                <strong className="w-[100px]">Khách
                  Hàng:</strong> {selectedCancel.invoiceID.guestInfo.name}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Email:</strong> {selectedCancel.invoiceID.guestInfo.email}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Số điện
                  thoại:</strong> {selectedCancel.invoiceID.guestInfo.phone}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Ngày
                  Tạo:</strong> {new Date (selectedCancel.dayReq).toLocaleString ('vi-VN')}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Tổng
                  Tiền:</strong> {formatMoney (selectedCancel.refundAmount)}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Phương thức thanh
                  toán:</strong> {selectedCancel.invoiceID.guestInfo.paymentMethod || 'Chưa có thông tin'}
              </p>
              <p className="flex items-center mb-1">
                <strong className="w-[100px]">Trạng
                  Thái:</strong> {selectedCancel.isAccept === 'accepted' ? 'Đã chấp nhận' : selectedCancel.isAccept === 'processing' ? 'Chờ xử lý' : 'Đã từ chối'}
              </p>
              <p className="mb-1"><strong>Ngày nhận
                phòng:</strong> {new Date (selectedCancel.invoiceID.guestInfo.checkInDay).toLocaleDateString ('vi-VN')}
              </p>
              <p className="mb-1"><strong>Ngày trả
                phòng:</strong> {new Date (selectedCancel.invoiceID.guestInfo.checkOutDay).toLocaleDateString ('vi-VN')}
              </p>
              <p className="mb-1"><strong>Chứng minh nhân
                dân:</strong> {selectedCancel.invoiceID.guestInfo.idenCard}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              {/* <p className="mb-2"><strong>Thông tin Hóa Đơn:</strong></p> */}
              <div>
                {isProcess === false && selectedCancel?.adminID && (
                  <>
                    <p className="flex items-center mb-1">
                      <strong className="w-[100px]">Admin xử
                        lý:</strong> {selectedCancel.adminID.adminName || 'Không có'}
                    </p>
                    <p className="flex items-center mb-1">
                      <strong className="w-[100px]">Lý do từ
                        chối:</strong> {selectedCancel.rejectedReason || 'Không có'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
      <div className="fixed bottom-5 right-5">

        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
          <div onClick={() => setFilterModalVisible (true)}
               className="text-white shadow-xl flex items-center text-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-800 to-blue-600 cursor-pointer hover:scale-105 transition-transform duration-300">
            <ListFilter size={24}/>
          </div>

        </div>
      </div>
      <Modal
        title="Lọc Theo Ngày"
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible (false)}
        footer={null}
      >
        <div className="flex justify-center">
          <DatePicker
            value={filterDate ? moment (filterDate, 'DD/MM/YYYY') : null}
            onChange={handleFilterChange}
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
          />
        </div>
      </Modal>
    </div>

  );
};

export default CancelReqAdmin;
