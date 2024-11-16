import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, notification, Spin, Alert } from 'antd';

const UpdateHotel = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  
  const [errMessage, setErrMessage] = useState('');  
  const [form] = Form.useForm();
  const BE_PORT=import.meta.env.VITE_BE_PORT
  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);  
      try {
        const response = await axios.get(`${BE_PORT}/api/hotelList/hotel/${id}`);
        const hotelData = response.data;  
        form.setFieldsValue(hotelData);  
      } catch (error) {
        setErrMessage("Failed to load hotel data.");
      } finally {
        setLoading(false);  
      }
    };
    fetchHotelData(); 
  }, [id, form]);

  const onFinish = async (values) => {
    setErrMessage(''); 
    try {
      const response = await axios.post(`${BE_PORT}/api/hotelList/updateHotel/${id}`, {
        ...values,
      });

      if (response.data.status === 'OK') {
        notification.success({
          message: 'Hotel Updated Successfully',
          description: 'The hotel has been updated successfully!',
        });
        navigate('/Admin/hotel'); 
      } else {
        setErrMessage('Hotel updates failed!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
      notification.error({
        message: 'Hotel Updates Failed',
        description: errorMessage,
      });
      setErrMessage(errorMessage); 
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center ">
      <Form
        form={form}  
        name="UpdateHotel"
        className='py-8 h-auto'
        onFinish={onFinish} 
      >
        <h1 className="text-xl font-bold mb-4 text-black">Cập Nhật Khách Sạn</h1>

        {errMessage && <div className="text-red-500">{errMessage}</div>}

        <Form.Item
          label={<span className="text-black">Tên Khách Sạn</span>}
          name="hotelName"
          rules={[{ required: true, message: 'Please input hotel name!' }]}
        >
          <Input placeholder="Hotel Name" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Địa Chỉ</span>}
          name="address"
          rules={[{ required: true, message: 'Please input hotel address!' }]}
        >
          <Input placeholder="Address" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Thành Phố</span>}
          name="city"
          rules={[{ required: true, message: 'Please input city!' }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Quốc Tịch</span>}
          name="nation"
          rules={[{ required: true, message: 'Please input nation!' }]}
        >
          <Input placeholder="Nation" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Loại Khách Sạn</span>}
          name="hotelType"
          rules={[{ required: true, message: 'Please input hotel type!' }]}
        >
          <Input placeholder="Hotel Type" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Số Điện Thoại</span>}
          name="phoneNum"
          rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Hình Ảnh</span>}
          name="imgLink"
          rules={[{ required: true, message: 'Please input image link!' }]}
        >
          <Input placeholder="Image Link (optional)" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-blue-800 hover:bg-blue-300">
            Cập Nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateHotel;
