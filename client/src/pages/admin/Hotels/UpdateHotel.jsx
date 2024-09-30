import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, notification } from 'antd';
import { useParams } from 'react-router-dom';
const UpdateHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState('');

  const onFinish = async (values) => {
    
    setErrMessage(''); 
    const { data, error, loading } = useGet(
      "http://localhost:4000/api/hotelList/hotel/${id}"
    );
  
    if (loading) {
      return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
    }
  
    if (error) {
      return (
        <Alert
          message="Error"
          description="Failed to load properties."
          type="error"
          showIcon
        />
      );
    }
    try {
      const response = await axios.post('http://localhost:4000/api/hotelList/updateHotel', {
        ...values,
      });

      if (response.data.status === 'OK') {
        notification.success({
          message: 'Hotel Created Successfully',
          description: 'The hotel has been created successfully!',
        });

        navigate('Admin/hotels'); 
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
    <div className="h-screen w-full flex justify-center items-center ">
      <Form
        name="UpdateHotel"
        className='py-8 h-auto  '
        onFinish={onFinish}
      >
        <h1 className="text-xl font-bold mb-4 text-black">Create New Hotel</h1>

        {errMessage && <div className="text-red-500">{errMessage}</div>}

        <Form.Item
label={<span className="text-black">Hotel Name</span>}
 name="hotelName"
          rules={[{ required: true, message: 'Please input hotel name!' }]}
        >
          <Input placeholder="Hotel Name" />
        </Form.Item>

        <Form.Item
              label={<span className="text-black">Address</span>}
          name="address"
          rules={[{ required: true, message: 'Please input hotel address!' }]}
        >
          <Input placeholder="Address" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">City</span>}
          name="city"
          rules={[{ required: true, message: 'Please input city!' }]}
        >
          <Input placeholder="City" />
        </Form.Item>

        <Form.Item
          label={<span className="text-black">Nation</span>}
          name="nation"
          rules={[{ required: true, message: 'Please input nation!' }]}
        >
          <Input placeholder="Nation" />
        </Form.Item>

        <Form.Item
         label={<span className="text-black">Hotel Type</span>}
          name="hotelType"
          rules={[{ required: true, message: 'Please input hotel type!' }]}
        >
          <Input placeholder="Hotel Type" />
        </Form.Item>

        <Form.Item
         label={<span className="text-black">Phone</span>}
          name="phoneNum"
          rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input placeholder="Phone Number" />
        </Form.Item>
        <Form.Item
          label={<span className="text-black">Image</span>}
          name="imgLink"
          rules={[{ required: true}]} 
        >
          <Input placeholder="Image Link (optional)" />
        </Form.Item>

        <Form.Item
            label={<span className="text-black">Owner ID</span>}
          name="ownerID"
          rules={[{ required: true, message: 'Please input an existing owner ID!' }]}
        >
          <Input placeholder="Owner ID" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full bg-blue-800 hover:bg-blue-300">
            Update Hotel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateHotel;
