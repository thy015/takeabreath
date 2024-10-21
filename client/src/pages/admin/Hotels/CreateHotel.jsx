import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, notification, Row, Col, Spin, Alert, Modal, Image } from 'antd';
import { useGet } from "../../../hooks/hooks";
import { AuthContext } from '../../../hooks/auth.context'
import { seletedHotel, setHotels } from '../../../hooks/redux/hotelsSclice';
import { useSelector, useDispatch } from "react-redux";
import { addHotel, updateHotels } from '../../../hooks/redux/hotelsSclice';
import { openNotification } from '../../../hooks/notification';
const { Option } = Select;

const CreateHotel = ({ visible, handleCancel }) => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const hotelSelected = useSelector(state => state.hotel.selectedHotel)
  const [hotel, setHotels] = useState(pre => hotelSelected)
  const [errMessage, setErrMessage] = useState('');
  const [imageURL, setImage] = useState('')
  const [form] = Form.useForm();
  const { data: owners, error: ownerError, loading: ownerLoad } = useGet("http://localhost:4000/api/auth/owner");
  const [initialValues, setInitialValues] = useState({});
  useEffect(() => {
    form.setFieldsValue({
      hotelName: hotelSelected.hotelName ?? "",
      address: hotelSelected.address ?? "",
      city: hotelSelected.city ?? "",
      hotelType: hotelSelected.hotelType ?? "",
      phoneNum: hotelSelected.phoneNum ?? "",
      nation: hotelSelected.nation ?? "",
    });
  }, [visible, hotelSelected, form])
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

  const setValue = (nameInput) => {
    if (hotelSelected != {}) {
      console.log("Set")
    } else {
      console.log(null)
    }
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

  const isEmpty = (obj) => Object.keys(obj).length === 0;

  const onFinish = async (values) => {
    const form = {
      ...values,
      imgLink: String(imageURL) ? String(imageURL) : String(hotelSelected.imgLink),
      ownerID: auth.user.id
    }
    console.log(hotelSelected)
    if (hotelSelected === undefined || !isEmpty(hotelSelected)) {
      console.log("Update")
      try {
        const response = await axios.post(`http://localhost:4000/api/hotelList/updateHotel/${hotelSelected._id}`, form);
        if (response.data.status === 'OK') {
          openNotification(true, "Cập nhật thành công", "")
          dispatch(updateHotels(response.data.data))
          
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
    } else {
      try {
        const response = await axios.post('http://localhost:4000/api/hotelList/createHotel', form);
        if (response.data.status === 'OK') {
          openNotification(true, "Thêm thành công", "")
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
    }
    setErrMessage('');

  };

  return (

    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={'50%'}
    >
      <Form
        form={form}
        labelCol={{ span: 15 }}
        wrapperCol={{ span: 15 }}
        width={700}
        name="createHotel"
        className="h-auto"
        onFinish={onFinish}
        initialValues={{
          hotelName: hotelSelected?.hotelName || '',
          address: hotelSelected?.address || '',
          city: hotelSelected?.city || '',
          hotelType: hotelSelected?.hotelType || '',
          phoneNum: hotelSelected?.phoneNum || '',
          nation: hotelSelected?.nation || '',
        }}
      >
        <h1 className="text-xl font-bold mb-10 text-blue-900 text-center">{isEmpty(hotelSelected) ? "Tạo Mới Khách Sạn" : "Cập Nhật Khách Sạn"}</h1>

        {errMessage && <div className="text-red-500">{errMessage}</div>}
        <Col span={12}>
          <Form.Item
            width={700}
            label="Tên khách sạn"
            name="hotelName"
            rules={[{ required: true, message: 'Please input hotel name!' }]}
          >
            <Input placeholder={hotelSelected?.hotelName ?? "Hotel Name"} className='w-[350px]' />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Please input hotel address!' }]}
          >

            <Input placeholder={hotelSelected?.address ?? "Address"} className='w-[350px]' type='input' />
          </Form.Item>

          <Form.Item
            label="Thành phố"
            name="city"
            rules={[{ required: true, message: 'Please input city!' }]}
          >
            <Input placeholder={hotelSelected?.city ?? "City"} className='w-[350px]' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Loại chỗ ở"
            name="hotelType"
            rules={[{ required: true, message: 'Please input hotel type!' }]}
          >
            <Input placeholder={hotelSelected?.hotelType ?? "Hotel Type"} className='w-[350px]' />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNum"
            rules={[{ required: true, message: 'Please input phone number!' }]}
          >
            <Input placeholder={hotelSelected?.phoneNum ?? "Phone Number"} className='w-[350px]' />
          </Form.Item>
          <Form.Item
            label="Quốc gia"
            name="nation"
            rules={[{ required: true, message: 'Please input nation!' }]}
          >
            <Input placeholder={hotelSelected?.nation ?? "Nation"} className='w-[350px]' />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Link hình ảnh"
            name="imgLink"
          >
            <Input placeholder="Image Link" type='file' onChange={handleImage} className='w-[350px]' />
          </Form.Item>
        </Col>
        <div className='items-center d-flex justify-center mb-[10px]'>
          <Image className='items-center' src={hotelSelected?.imgLink ?? imageURL} />
        </div>
        <Form.Item wrapperCol={{ span: 23 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {
              hotelSelected?.address ?
                <Button
                  type="danger"
                  htmlType="submit"
                  className="bg-blue-900 hover:bg-blue-400 text-white"
                >
                  Cập nhật
                </Button>
                :
                <Button
                  type="danger"
                  htmlType="submit"
                  className="bg-blue-900 hover:bg-blue-400 text-white"
                >
                  Tạo Khách Sạn
                </Button>
            }

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
