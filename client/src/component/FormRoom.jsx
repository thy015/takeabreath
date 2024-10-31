import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, InputNumber, Row, Col, Image, Select } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { openNotification } from '../hooks/notification'
import { addRoom,updateRooms } from "../hooks/redux/roomsSlice"
import { setHotels } from '../hooks/redux/hotelsSclice';
import { useForm } from 'antd/es/form/Form';
import CryptoJS from "crypto-js"
import axios from 'axios';
function FormRoom({ isVisible, close }) {
    const [images, setImages] = useState([])
    const [form] = useForm()
    const [typeRooms, setTypeRooms] = useState([])
    const selectedRoom = useSelector(state => state.room.selectRoom)
    const hotels = useSelector(state => state.hotel.hotels)
    const dispatch = useDispatch()
    useEffect(() => {
        axios.get(" http://localhost:4000/api/hotelList/roomTypes")
            .then(res=>res.data)
            .then(data=>{
                const array = data.types
                const temp = array.map(item =>({
                    value:item,
                    label:item
                }))
                setTypeRooms(temp)
            })
        axios.get("http://localhost:4000/api/hotelList/hotelOwner")
            .then(res => res.data)
            .then(data => {
                const hotels = data.data.map((item => (
                    {
                        ...item,
                        key: item._id
                    }
                )))
                dispatch(setHotels(hotels))
            })
            .catch(err => console.log(err))

    }, [])
    const option = hotels.map(item => (
        {
            value: item._id,
            label: item.hotelName
        }
    ))
    useEffect(() => {
        form.setFieldsValue({
            roomName: selectedRoom.roomName ?? "",
            typeOfRoom: selectedRoom.typeOfRoom ?? "",
            capacity: selectedRoom.capacity ?? "",
            numberOfRooms: selectedRoom.numberOfRooms ?? "",
            numberOfBeds: selectedRoom.numberOfBeds ?? "",
            money: selectedRoom.money ?? "",
            hotelID: selectedRoom?.hotelID?._id ?? "",
        });
        setImages(selectedRoom.imgLink??[])
    }, [isVisible, selectedRoom, form])
    const handleImage = async (e) => {
        e.stopPropagation()
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
                uploadedImageURL.url,
            ])
        }
    }
    const handleDelete = async (item) => {
        setImages(pre => pre.filter(image => image !== item))
    }
    const hanldeInsert = async () => {
        form.submit()
    }
    const onFinish = async (values) => {
        const formInput = {
            ...values,
            imgLink: images
        }

        if(isEmpty(selectedRoom)){
            axios.post("http://localhost:4000/api/hotelList/createRoom", formInput)
            .then(res => res.data)
            .then(data => {
                dispatch(addRoom(data.data))
                openNotification(true, "Tạo phòng thành công", "")
                close()
            })
            .catch(err => {
                console.log(err)
                openNotification(false, "Tạo phòng thất bại", err.response.data.message)
            })
        }else{
            axios.post(`http://localhost:4000/api/hotelList//updateRoom/${selectedRoom._id}`, formInput)
            .then(res => res.data)
            .then(data => {
                console.log("[UPDATE]",data.data)
                dispatch(updateRooms(data.data))
                openNotification(true, "Cập nhật phòng thành công", "")
                close()
            })
            .catch(err => {
                console.log(err)
                openNotification(false, "Tạo phòng thất bại", err.response.data.message)
            })
        }
    }
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    return (
        <>
            {console.log(isEmpty(selectedRoom))}
            <Modal
                okText={ isEmpty(selectedRoom) ? "Thêm phòng" : "Cập nhật "}
                cancelText="Trở lại"
                width={"50%"}
                open={isVisible}
                onCancel={close}
                onOk={hanldeInsert}
            >
                <div className='text-[20px] font-bold items-center text-center  text-blue-900 m-[10px] mb-[20px]'>{isEmpty(selectedRoom) ? "Thêm phòng" : "Cập nhật phòng"}</div>
                <Form
                    onFinish={onFinish}
                    form={form}
                    labelAlign='left'
                    className="h-auto ml-[20px]"
                    wrapperCol={{
                        span: 16,
                    }}
                    labelCol={{
                        span: 6
                    }}
                    name="createRoom"
                >
                    <Form.Item

                        label={"Nhập tên phòng"}
                        name={"roomName"}
                        rules={[{ required: true, message: 'Vui lòng nhâp tên phòng !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item

                        label={"Loại phòng"}
                        name={"typeOfRoom"}
                        rules={[{ required: true, message: 'Vui lòng nhâp tên loại phòng !' }]}
                    >
                        <Select options={typeRooms} />
                    </Form.Item>
                    <Form.Item
                        label={"Sức chứa"}
                        name={"capacity"}
                        rules={[{ required: true, message: 'Vui lòng nhâp không gian phòng !' }]}
                    >
                        <InputNumber className='w-[100%]' />
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{
                                    span: 10
                                }}
                                label={"Số  lượng"}
                                name={"numberOfRooms"}
                                rules={[{ required: true, message: 'Vui lòng nhâp số lượng phòng !' }]}
                            >
                                <InputNumber className='inputnumber-room' max={100} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{
                                    span: 11
                                }}
                                label={"Số giường"}
                                name={"numberOfBeds"}
                                rules={[{ required: true, message: 'Vui lòng nhâp số lượng giường !' }]}
                            >
                                <InputNumber max={30} min={0} className='inputnumber-room ' />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        label={"Giá tiền"}
                        name={"money"}
                        rules={[{ required: true, message: 'Vui lòng nhập giá tiền !' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                    <Form.Item
                        label={"Thuộc khách sạn"}
                        name={"hotelID"}
                        rules={[{ required: true, message: 'Vui lòng chọn khách sạn !' }]}
                    >

                        <Select className=' w-[87%]' options={option} />
                    </Form.Item>
                    <Form.Item
                        label={"Chọn hình"}
                        name={"imgLink"}
                    >
                        <Input type="file" className='w-[87%]' onChange={handleImage} multiple />
                    </Form.Item>
                </Form>
                <div className=' flex gap-4 justify-center items-center'>
                    {images?.map(item => (
                        <div className="relative inline-block overflow-hidden">
                        <Image src={item} className="object-cover rounded-md" alt="item" />
                        <button
                            className="absolute top-1 right-1 bg-red-500 text-center items-center text-white rounded-full p-1 w-[20px] h-[20px] flex justify-center"
                            onClick={() => handleDelete(item)}
                        >
                            x
                        </button>
                    </div>
                    ))}

                </div>
            </Modal>
        </>

    )
}

export default FormRoom