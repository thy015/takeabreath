import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, notification, Row, Col, Spin, Alert, Modal, Image } from 'antd';
import { useGet } from "../../../hooks/hooks";
import { AuthContext } from '../../../hooks/auth.context'
import { setHotels } from '../../../hooks/redux/hotelsSclice';
import { useSelector,useDispatch } from "react-redux";
import { addHotel } from '../../../hooks/redux/hotelsSclice';
const { Option } = Select;

const CreateHotel = ({ visible, handleCancel }) => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [errMessage, setErrMessage] = useState('');
  const [imageURL, setImage] = useState('')
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

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    axios.defaults.withCredentials = true
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "uploat_data")
    data.append("cloud_name", "da5mlszld")

    const res = await fetch("https://api.cloudinary.com/v1_1/da5mlszld/image/upload", {
      method: "POST",
      body: data
    })

    const uploadedImageURL = await res.json()
    console.log(uploadedImageURL)
    setImage(uploadedImageURL.url)
    console.log(imageURL)
  }

  const onFinish = async (values) => {
    console.log(values)
    const form = {
      ...values,
      imgLink: String(imageURL),
      ownerID: auth.user.id
    }
    setErrMessage('');
    try {
      const response = await axios.post('http://localhost:4000/api/hotelList/createHotel', form);

      if (response.data.status === 'OK') {
        notification.success({
          message: 'Hotel Created Successfully',
          description: 'The hotel has been created successfully!',
        });
        dispatch(addHotel(form))
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
      open={visible}
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
              label="Quốc gia"
              name="nation"
              rules={[{ required: true, message: 'Please input nation!' }]}
            >
              <Input placeholder="Nation" />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Link hình ảnh"
              name="imgLink"
            >
              <Input placeholder="Image Link" type='file' onChange={handleImage} />
            </Form.Item>
          </Col>

        </Row>
        <div className='items-center d-flex justify-center mb-[10px]'>
          <Image className='items-center' src={imageURL} />
        </div>
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
          <button className="btn btn-danger  w-1/4 h-full items-center bg-red-600 text-white hover:bg-red-300 rounded-full" onClick={onConfirm}>Xóa</button>
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
