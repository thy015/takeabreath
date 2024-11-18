import React, { useState,useEffect} from "react";
import { Spin, Alert, Table, Tag, Modal, notification } from "antd";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useGet } from "../../../hooks/hooks";

const CustomersList = () => {
  const [refresh, setRefresh] = useState(false);
    const BE_PORT=import.meta.env.VITE_BE_PORT
  const { data, error, loading } = useGet(`${BE_PORT}/api/auth/customer`, refresh);
  const [searchText, setSearchText] = useState("");
  const [cusID, setCusID] = useState(null);
  const [reason, setReason] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activateModalVisible, setActivateModalVisible] = useState(false);

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

  const handleConfirm = async () => {
    try {
        const response = await axios.put(`${BE_PORT}/api/cancelReq/inactive/${cusID}`, {
            reason: reason,
        });
        if (response.data.success) {
            notification.success({
                message: 'Vô Hiệu Hóa Thành Công',
                description: 'Tài khoản khách hàng đã bị khóa!',
            });
            handleDeleteCancel();
            setRefresh(prev => !prev); 
        } else {
            notification.error({
                message: 'Vô Hiệu Hóa Thất Bại',
                description: 'Vô hiệu hóa tài khoản thất bại!',
            });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
        notification.error({
            message: 'Vô Hiệu Hóa Thất Bại',
            description: errorMessage,
        });
    }
};

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setCusID(null);
    setReason(""); 
  };

  const handleActivateConfirm = async () => {
    try {
        const response = await axios.put(`${BE_PORT}/api/cancelReq/active/${cusID}`);
        if (response.data.success) {
            notification.success({
                message: 'Kích Hoạt Thành Công',
                description: 'Tài khoản khách hàng đã được kích hoạt thành công!',
            });
            setRefresh(prev => !prev); 
            setActivateModalVisible(false);
        } else {
            notification.error({
                message: 'Kích Hoạt Thất Bại',
                description: 'Tài khoản khách hàng đã kích hoạt thất bại!',
            });
        }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
        notification.error({
            message: 'Kích Hoạt Thất Bại',
            description: errorMessage,
        });
    }
};

  const columns = [
    { title: "Họ Tên", dataIndex: "cusName", key: "cusName", width: '25%' },
    { title: "Email", dataIndex: "email", key: "email",  width: '25%' },
    { title: "Số Điện Thoại", dataIndex: "phoneNum", key: "phoneNum" },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: "Đã kích hoạt", value: true },
        { text: "Vô hiệu hóa", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive, record) => (
        <Tag
          color={isActive ? "green" : "red"}
          onClick={isActive ? () => {
            setCusID(record._id);
            setDeleteModalVisible(true);
          } : () => {
            setCusID(record._id);
            setActivateModalVisible(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {isActive ? "Đã kích hoạt" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
  ];

  const formattedData = data
    .map(customer => ({
      ...customer,
      key: customer._id,
      birthday: new Date(customer.birthday).toLocaleDateString(),
    }))
    .filter(customer =>
      (customer.cusName && customer.cusName.toLowerCase().includes(searchText.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchText.toLowerCase()))
    );

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả khách hàng
        </h1>
        <div className="relative pb-2.5">
          <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3" />
          <input
            type="text"
            className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <Table
        className="mt-4 border-2 rounded-s"
        columns={columns}
        dataSource={formattedData}
        pagination={{ pageSize: 10 }}
      />
      <ModalDelete
        open={deleteModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleConfirm}
        reason={reason}
        setReason={setReason}
        header={"vô hiệu hóa tài khoản"}
      />
      <ModalActivate
        open={activateModalVisible}
        onClose={() => setActivateModalVisible(false)}
        onConfirm={handleActivateConfirm}
        header={"Kích hoạt tài khoản"}
      />
    </div>
  );
};

export const ModalDelete = ({ open, onClose, onConfirm, reason, setReason,header }) => {
  return (
    <Modal
      className="justify-center items-center"
      footer={null}
      visible={open}
      onCancel={onClose}
    >
      <div className="text-center">
        <div className="mx-auto my-4 w-64">
          <h3 className="text-lg w-full font-black text-blue-900"> Vui lòng nhập lí do {header} này</h3>
        
          <input
            type="text"
            placeholder="Lí do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 border rounded p-1 w-full"
          />
        </div>
        <div className="flex justify-around">
          <button onClick={onClose} className="bg-gray-600 w-1/4  text-white rounded hover:bg-gray-300">
          Hủy
          </button>
          <button onClick={onConfirm} className="bg-red-500  w-1/4 text-white p-2 rounded hover:bg-red-300">
          Chấp nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const ModalActivate = ({ open, onClose, onConfirm,header }) => {
  return (
    <Modal
      className="justify-center items-center"
      footer={null}
      visible={open}
      onCancel={onClose}
    >
      <div className="text-center">
        <h3 className="text-lg font-black text-blue-900">{header}</h3>
        <p className="text-sl text-gray-500">
          Bạn có chắc muốn {header} của khách hàng này ?
        </p>
        <div className="flex justify-around mt-4">
          <button onClick={onClose} className="bg-gray-600 w-1/4  text-white rounded hover:bg-gray-300">
           Hủy
          </button>
          <button onClick={onConfirm} className="bg-green-500 w-1/4 text-white p-2 rounded hover:bg-green-300">
            Chấp nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomersList;
