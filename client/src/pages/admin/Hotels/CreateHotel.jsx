import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, notification, Row, Col, Spin, Alert, Modal } from 'antd';
import { useGet } from "../../../hooks/hooks";

const { Option } = Select;

const CreateHotel = ({ visible, handleCancel }) => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState('');
  

  const { data: owners, error: ownerError, loading: ownerLoad } = useGet("http://localhost:4000/api/auth/owner");

  if (ownerLoad) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (ownerError) {
    return (
      <Alert
        message="Error"
        description="Failed to load owners."
        type="error"
        showIcon
      />
    );
  }

  const onFinish = async (values) => {
    setErrMessage('');
    try {
      const response = await axios.post('http://localhost:4000/api/hotelList/createHotel', {
        ...values,
      });

      if (response.data.status === 'OK') {
        notification.success({
          message: 'Hotel Created Successfully',
          description: 'The hotel has been created successfully!',
        });
        navigate('/Admin/hotel');
        handleCancel(); 
      } else {
        setErrMessage('Hotel creation failed!');
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Hotel Creation Failed',
        description: errorMessage,
      });
      setErrMessage(errorMessage);
    }
  };

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={'50%'}
    >
      <Form
        labelCol={{ span: 15 }}
        wrapperCol={{ span: 15 }}
        name="createHotel"
        className="h-auto"
        onFinish={onFinish}
      >
        <h1 className="text-xl font-bold mb-10 text-blue-900 text-center">Tạo Mới Khách Sạn</h1>

        {errMessage && <div className="text-red-500">{errMessage}</div>}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Please input hotel name!' }]}
            >
              <Input placeholder="Hotel Name" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Please input hotel address!' }]}
            >
              <Input placeholder="Address" />
            </Form.Item>

            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: 'Please input city!' }]}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              label="Quốc tịch"
              name="nation"
              rules={[{ required: true, message: 'Please input nation!' }]}
            >
              <Input placeholder="Nation" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Loại chỗ ở"
              name="hotelType"
              rules={[{ required: true, message: 'Please input hotel type!' }]}
            >
              <Input placeholder="Hotel Type" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNum"
              rules={[{ required: true, message: 'Please input phone number!' }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              label="Link hình ảnh"
              name="imgLink"
              rules={[{ required: true, message: 'Please input image link!' }]}
            >
              <Input placeholder="Image Link" />
            </Form.Item>

            <Form.Item
              label="Chủ sở hữu"
              name="ownerID"
              rules={[{ required: true, message: 'Please select an owner!' }]}
            >
              <Select placeholder="Select Owner">
                {owners.map((owner) => (
                  <Option key={owner._id} value={owner._id}>
                    {owner.ownerName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 23 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="danger"
              htmlType="submit"
              className="bg-blue-900 hover:bg-blue-400 text-white"
            >
              Tạo Khách Sạn
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const ModalDelete = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
    className="justify-center items-center"
    footer={null}
      visible={open}
      onOk={onConfirm}
      onCancel={onClose}
    >
    <div className="text-center">
  
  <div className="mx-auto my-4 w-48">
    <h3 className="text-lg font-black text-blue-900">Xóa Khách Sạn</h3>
    <p className="text-sl text-gray-500">
      Bạn có chắc là muốn xóa khách sạn này chứ ?
    </p>
  </div>
  <div className="flex gap-4 items-center justify-center">
    <button className="btn btn-danger  w-1/4 h-full items-center bg-red-600 text-white hover:bg-red-300 rounded-full"  onClick={onConfirm}>Xóa</button>
    <button
      className="btn btn-light w-1/4 h-full items-center bg-black text-white hover:bg-gray-200 rounded-full"
      onClick={onClose}
    >
      Hủy
    </button>
  </div>
</div>
    </Modal>
  );
};
export { CreateHotel, ModalDelete };
