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
import ModalAmenities from '../../../component/ModalAmenities';
import { addAmenity } from '../../../hooks/redux/hotelsSclice';
const { Option } = Select;

const CreateHotel = ({ visible, handleCancel }) => {
  const { auth } = useContext(AuthContext)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const hotelSelected = useSelector(state => state.hotel.selectedHotel)
  const [type, setType] = useState([])
  const [nations, setnation] = useState([])
  const [cities, setCities] = useState([])
  const [errMessage, setErrMessage] = useState('');
  const BE_PORT = import.meta.env.VITE_BE_PORT
  const [images, setImages] = useState([])
  const [form] = Form.useForm();
  const { data: owners, error: ownerError, loading: ownerLoad } = useGet(`${BE_PORT}/api/auth/owner`);
  const [visibleAm, setVisibleAm] = useState(false)
  const amenity = useSelector(state => state.hotel.amenity)

  const initalAmenities = {
    bathroom: [],
    bedroom: [],
    dining: [],
    entertainment: [],
    heatingAndCooling: [],
    location: [],
    outdoor: [],
    safety: [],
    service: [],
    view: []
  }
  // Get data 
  useEffect(() => {

    //Get Tinh Thanh
    fetch("https://provinces.open-api.vn/api/", {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const arrayCity = data
        let temp = arrayCity.map(item => ({
          value: item.name,
          label: item.name
        }))
        temp = [
          ...temp,
          {
            value: "",
            label: "Chọn tỉnh"
          }
        ]
        setCities(temp)
      })
      .catch(err => console.log(err))

    // Get Type holtel
    axios.get(`${BE_PORT}/api/hotelList/hotelTypes`)
      .then(res => res.data)
      .then(data => {
        const types = [
          ...data.types,
          "Chọn loại khách sạn"

        ]
        setType(types)
      })
      .catch(err => {
        console.log(err)
      })

    //Get nation
    // axios.get("https://restcountries.com/v3.1/all")
    //   .then(res => {
    //     const arrayNation = res.data
    //     const temp = arrayNation.map(item => ({
    //       value: item.name.common,
    //       label: item.name.common
    //     }))
    //     setnation(temp.sort((a, b) => a.value.localeCompare(b.value)))
    //   })

    //   .catch(err => { console.log(err) })
    setnation([
      {
        label: "Việt Nam",
        value: "Việt Nam"
      },
      {
        label: "Chọn quốc gia",
        value: ""
      }
    ])

  }, [])



  // Get data form when update or insert hotel
  useEffect(() => {
    // set input
    form.setFieldsValue({
      hotelName: hotelSelected.hotelName ?? "",
      address: hotelSelected.address ?? "",
      city: hotelSelected.city ?? "",
      hotelType: hotelSelected.hotelType ?? "",
      phoneNum: hotelSelected.phoneNum ?? "",
      nation: hotelSelected.nation ?? "",
    });

    const aniUpdate = hotelSelected?.hotelAmenities ?? {}
    let objectForm = {}
    let count = 0
    Object.entries(aniUpdate).map(([item, value]) => {
      count += value.length
      objectForm = {
        ...objectForm,
        [item]: value,

      }
    })
    objectForm = {
      ...objectForm,
      count: count
    }
    dispatch(addAmenity(objectForm ?? initalAmenities))

    // set image 
    setImages(hotelSelected.imgLink ?? [])
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

  const option = type.map((item, index) => {
    if (item === "Chọn loại khách sạn") {
      return {
        value: "",
        label: item
      }
    }
    return {
      value: item,
      label: item
    }

  })

  console.log(option)

  const handleDelete = async (item) => {
    setImages(pre => pre.filter(image => image !== item))
  }
  const handleImage = async (e) => {
    e.stopPropagation()
    let images = []
    const files = e.target.files
    let formData = new FormData()
    for (let i of files) {
      formData.append("file", i)
      formData.append("upload_preset", "uploat_data")
      const res = await fetch("https://api.cloudinary.com/v1_1/da5mlszld/image/upload", {
        method: "POST",
        body: formData
      })
      const uploadedImageURL = await res.json()
      setImages(pre => [
        ...pre,
        uploadedImageURL.url
      ])
    }
  }

  const isEmpty = (obj) => Object.keys(obj).length === 0;

  const onFinish = async (values) => {

    const { phoneNum } = values

    if (phoneNum.length != 10) {
      openNotification(false, "Số điện thoại phải là 10 chữ số", "")
      return
    }


    const form = {
      ...values,
      imgLink: images,
      ownerID: auth.user.id,
      hotelAmenities: amenity ?? []
    }
    if (hotelSelected === undefined || !isEmpty(hotelSelected)) {
      try {
        const response = await axios.post(`${BE_PORT}/api/hotelList/updateHotel/${hotelSelected._id}`, form);
        if (response.data.status === 'OK') {
          openNotification(true, "Cập nhật thành công", "")
          dispatch(updateHotels(response.data.data))

          handleCancel();
        } else {
          setErrMessage('Hotel creation failed!');
        }
      } catch (error) {
        console.error("Error details:", error);
        const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
        notification.error({
          message: 'Hotel Creation Failed',
          description: errorMessage,
        });
        setErrMessage(errorMessage);
      }
    } else {
      try {
        const response = await axios.post(`${BE_PORT}/api/hotelList/createHotel`, form);
        if (response.data.status === 'OK') {
          openNotification(true, "Thêm thành công", "")
          dispatch(addHotel(form))
          handleCancel();
        } else {
          setErrMessage('Hotel creation failed!');
        }
      } catch (error) {
        console.error("Error details:", error);
        const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";

        openNotification(false, "Thêm khách sạn thất bại", error.response?.data?.message || "Lỗi hệ thống")
      }
    }
    setErrMessage('');

  };
  return (

    <Modal
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={"80%"}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 15 }}
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

        <Form.Item
          label="Tên khách sạn"
          name="hotelName"
          rules={[{ required: true, message: 'Please input hotel name!' }]}
        >
          <Input placeholder={hotelSelected?.hotelName ?? "Hotel Name"} className='w-[85%]' />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Please input hotel address!' }]}
        >

          <Input placeholder={hotelSelected?.address ?? "Address"} className='w-[85%]' type='input' />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phoneNum"
          rules={[{ required: true, message: 'Please input phone number!' }]}
        >
          <Input placeholder={hotelSelected?.phoneNum ?? "Phone Number"} className='w-[85%]' maxLength={10} minLength={10} />
        </Form.Item>
        <Form.Item
          label="Tỉnh"
          name="city"
          rules={[{ required: true, message: 'Please input city!' }]}
        >
          <Select
            showSearch
            options={cities}
            style={{ width: "85%" }}
            defaultValue={""}
            className="text-center"
          />
        </Form.Item>

        <Form.Item
          label="Loại chỗ ở"
          name="hotelType"
          rules={[{ required: true, message: 'Please input hotel type!' }]}
        >
          <Select style={{ width: "85%" }} options={option} defaultValue={""} className='text-center' />
        </Form.Item>

        <Form.Item
          label="Quốc gia"
          name="nation"
          rules={[{ required: true, message: 'Please input nation!' }]}
        >
          <Select options={nations} style={{ width: "85%" }} defaultValue={""} className='text-center' />
        </Form.Item>
        <Form.Item
          label="Tiện ích"
          name="amenities"

        >
          <Button className='w-[85%]' onClick={() => setVisibleAm(true)} > {hotelSelected.hotelAmenities || amenity.count > 0 ? `Bạn đã thêm ${amenity.count} tiện ích` : "Thêm tiện ích"} </Button>
        </Form.Item>
        <Form.Item
          label="Link hình ảnh"
          name="imgLink"
        >
          <Input placeholder="Image Link" type='file' onChange={handleImage} multiple className='w-[85%]' />
        </Form.Item>

        <div className=' flex gap-4 justify-center items-center'>
          {images?.map(item => (
            <div key={item} className="relative w-1/3 h-1/3">
              <Image src={item} className='object-cover rounded-md' />
              <button
                className="absolute top-2 right-2 bg-red-500 text-center items-center text-white rounded-full p-1 w-[20px] h-[20px] flex  justify-center"
                onClick={() => handleDelete(item)}
              >
                x
              </button>
            </div>
          ))}

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

      <ModalAmenities
        visible={visibleAm}
        close={() => {
          setVisibleAm(false)
        }}
      ></ModalAmenities>
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
