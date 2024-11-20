import React, { useState, useEffect, useContext } from "react";
import { Spin, Alert, Table, Tag, Modal, notification,Space,Button,Form } from "antd";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useGet } from "../../../hooks/hooks";
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import ModalAdd from "./AddVoucher";
import { AuthContext } from "../../../hooks/auth.context";
import moment from 'moment'
const VouchersList = () => {
  
  const { auth } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [header, setHeader] = useState("Thêm Voucher");
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const { data, error, loading } = useGet(`${BE_PORT}/api/voucher/sysvou`, refresh);
  const [searchText, setSearchText] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [form] = Form.useForm(); 
  const getName = (name) => {
    return name
      .split(' ')             
      .map((word) => word[0])   
      .join('')                
      .toUpperCase();         
  };
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load vouchers."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No voucher data found" type="info" showIcon />;
  }

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`${BE_PORT}/api/voucher/deletevou/${selectedVoucherId}`);
      if (response.status === 200) {
        notification.success({
          message: 'Xóa Voucher Thành Công',
          description: 'Voucher đã được xóa thành công!',
        });
        handleCancelDelete();
        setRefresh(prev => !prev);
      } else {
        notification.error({
          message: 'Xóa Voucher Thất Bại',
          description: 'Gặp lỗi trong quá trình xóa voucher!',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Xóa Voucher Thất Bại',
        description: 'An error occurred while deleting the voucher.',
      });
    }
  };
  const showDeleteModal = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setDeleteModalVisible(true);
    console.log("voucher id "+voucherId);
  };
  const handleCancelDelete=async()=>{
    setDeleteModalVisible(false);
    setSelectedVoucherId(null);
      }
  const handleEditVoucher = async (voucherId) => {
    try {
      const response = await axios.get(`${BE_PORT}/api/voucher/sysvou/${voucherId}`);
      form.setFieldsValue({
        code:response.data.code,
        voucherName: response.data.voucherName,
        discount: response.data.discount,
        dates: [moment(response.data.startDay), moment(response.data.endDay)],
        ownerJoined:response.data.ownerJoined,
      });
      setSelectedVoucherId(voucherId);
      setHeader("Chỉnh sửa Voucher");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };
 
  const handleAddOrUpdateVoucher = async (values) => {
    if(!values.code)
    {
      values.code =getName(values.voucherName)
    }
    const formattedValues = {
      ...values,
      startDay: values.dates[0].toISOString(), 
      endDay: values.dates[1].toISOString(),
      adminID: auth.user.id,
    };
    try {
      if (selectedVoucherId) {
        await axios.post(`${BE_PORT}/api/voucher/updatevou/${selectedVoucherId}`, {
          voucherName:values.voucherName,
          code: values.code,
          discount: values.discount ,
          startDay: values.dates[0],
          endDay: values.dates[1],
          adminID:auth.user.id,
          ownerJoined:values.ownerJoined,
        });
        setRefresh(prev => !prev); 
        notification.success({
          message: 'Cập Nhật Voucher Thành Công',
          description: 'Voucher đã được cập nhật!',
        });

      } else {
        await axios.post(`${BE_PORT}/api/voucher/addvou`, {
          ...formattedValues
        });
        setRefresh(prev => !prev); 
        notification.success({
          message: 'Thêm Voucher Mới Thành Công',
          description: 'Voucher đã được thêm thành công!',
        });
        form.resetFields();
      }
 
      setIsModalVisible(false);
      setSelectedVoucherId(null); 
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý voucher:", error);
      notification.error({
        message: 'Tạo Voucher Thất Bại',
        description: error.response?.data?.message || "An unknown error occurred.",
      });
    }
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedVoucherId(null);
    form.resetFields();  
  };
 
  const columns = [
    { title: "Tên Voucher", dataIndex: "voucherName", key: "voucherName", width: '25%' },
    { title: "Chiết Khấu (%)", dataIndex: "discount", key: "discount", sorter: (a, b) => a.discount - b.discount, width: '15%' },
    { title: "Ngày Bắt Đầu", dataIndex: "startDay", key: "startDay", render: (startDay) => new Date(startDay).toLocaleDateString('vi-VN') },
    { title: "Ngày Kết Thúc", dataIndex: "endDay", key: "endDay", render: (endDay) => new Date(endDay).toLocaleDateString('vi-VN') },
    { title: "Mã Voucher", dataIndex: "code", key: "code" },
    {
      title: "Tùy Chọn",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
        <Button icon={<EditOutlined />}  onClick={() => handleEditVoucher(record._id)} className="text-yellow-500"  />
        <Button icon={<DeleteOutlined />}  onClick={()=>showDeleteModal(record._id)}className="text-red-500" />
      </Space>
      ),
    },
  ];

  const formattedData = data
    .map(voucher => ({
      ...voucher,
      key: voucher._id,
    }))
    .filter(voucher =>
      (voucher.voucherName && voucher.voucherName.toLowerCase().includes(searchText.toLowerCase())) ||
      (voucher.code && voucher.code.toLowerCase().includes(searchText.toLowerCase()))
    );

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px] h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Danh sách Voucher
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
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        <div onClick={() => { setHeader("Thêm Voucher"); setIsModalVisible(true); }} className="text-white shadow-xl flex items-center text-center justify-center p-3 rounded-full bg-gradient-to-r from-blue-800 to-blue-600 cursor-pointer hover:scale-105 transition-transform duration-300">
          <PlusOutlined />
        </div>
        
      </div>
      <ModalAdd
        visible={isModalVisible}
        onCancel={handleModalCancel}
      onOk={handleAddOrUpdateVoucher}
        form={form}
        header={header}
      />
        <ModalDelete
        open={deleteModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        header={"Voucher"}
      />
    </div>
  );
};

const ModalDelete = ({ open, onClose, onConfirm,header }) => {
  return (
    <Modal open={open} className="justify-center items-center" footer={null}  closable={false}>
    <div className="text-center">
  
      <div className="mx-auto my-4 w-48">
        <h3 className="text-lg font-black text-blue-800">Xóa {header}</h3>
        <p className="text-sm text-gray-500">
          Bạn có chắc là muốn xóa {header} này chứ ?
        </p>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <button className="btn btn-danger  w-1/4 h-full items-center bg-red-600 text-white hover:bg-red-300 rounded-full"  onClick={onConfirm}>Xóa</button>
        <button
          className="btn btn-light w-1/4 h-full items-center bg-black text-white hover:bg-gray-500 rounded-full"
          onClick={onClose}
        >
          Hủy
        </button>
      </div>
    </div>
  </Modal>
  );
};


export default VouchersList;
