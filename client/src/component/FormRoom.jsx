import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, InputNumber, Row, Col, Image, Select } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { openNotification } from '../hooks/notification'
import { addRoom, updateRooms } from "../hooks/redux/roomsSlice"
import { setHotels } from '../hooks/redux/hotelsSclice';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
function FormRoom({ isVisible, close }) {
    const [images, setImages] = useState([])
    const [form] = useForm()
    const [typeRooms, setTypeRooms] = useState([])
    const rooms = useSelector(state => state.room.rooms)
    const selectedRoom = useSelector(state => state.room.selectRoom)
    const hotels = useSelector(state => state.hotel.hotels)
    const dispatch = useDispatch()
    const BE_PORT = import.meta.env.VITE_BE_PORT
    console.log(selectedRoom)
    useEffect(() => {
        axios.get(`${BE_PORT}/api/hotelList/roomTypes`)
            .then(res => res.data)
            .then(data => {
                const array = data.types
                let temp = array.map(item => ({
                    value: item,
                    label: item
                }))
                temp = [
                    ...temp,
                    {
                        value: "",
                        label: "Chọn loại phòng"
                    }
                ]
                setTypeRooms(temp)
            })
        axios.get(`${BE_PORT}/api/hotelList/hotelOwner`)
            .then(res => res.data)
            .then(data => {
                let hotels = data.data.map((item => (
                    {
                        ...item,
                        key: item._id
                    }
                )))

                hotels = [
                    ...hotels,
                    {
                        value: "",
                        label: "Chọn khách sạn"
                    }
                ]
                dispatch(setHotels(hotels))
            })
            .catch(err => console.log(err))

    }, [])
    console.log(hotels)
    const option = hotels.map(item => (
        {
            value: item._id ?? item.value,
            label: item.hotelName ?? item.label
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
        setImages(selectedRoom.imgLink ?? [])
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
    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
    }
    const handleDelete = async (item) => {
        setImages(pre => pre.filter(image => image !== item))
    }
    const hanldeInsert = async () => {
        form.submit()
    }
    const onFinish = async (values) => {
        const { money } = values
        if (money < 0) {
            openNotification(false, "Giá tiền không được âm !", "")
            return
        }
        const formInput = {
            ...values,
            imgLink: images
        }

        if (isEmpty(selectedRoom)) {
            axios.post(`${BE_PORT}/api/hotelList/createRoom`, formInput)
                .then(res => res.data)
                .then(data => {
                    const room = {
                        ...data.data,
                        nameHotel: data.data.hotelID.hotelName
                    }
                    dispatch(addRoom(room))
                    openNotification(true, "Tạo phòng thành công", "")
                    close()
                })
                .catch(err => {
                    console.log(err)
                    openNotification(false, "Tạo phòng thất bại", err.response?.data?.message ?? "")
                })
        } else {
            axios.post(`${BE_PORT}/api/hotelList/updateRoom/${selectedRoom._id}`, formInput)
                .then(res => res.data)
                .then(data => {

                    const setValue = {
                        rooms: rooms,
                        update: data.data
                    }
                    dispatch(updateRooms(setValue))
                    openNotification(true, "Cập nhật phòng thành công", "")
                    close()
                })
                .catch(err => {
                    console.log(err)
                    openNotification(false, "Tạo phòng thất bại", err.response.data.message)
                })
        }
    }
    const removeLettersAndReturnValue = (value) => {
        // Kiểm tra và loại bỏ ký tự chữ (a-zA-Z) trong chuỗi
        const result = value.replace(/[a-zA-Z]/g, '');
        return result;
    };
    const isEmpty = (obj) => Object.keys(obj).length === 0;
    return (
        <>

            <Modal
                okText={isEmpty(selectedRoom) ? "Thêm phòng" : "Cập nhật "}
                cancelText="Trở lại"
                width={"50%"}
                open={isVisible}
                onCancel={close}
                onOk={hanldeInsert}
                bodyStyle={{ padding: '20px' }}
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
                        <Input placeholder='Nhập tên phòng' />
                    </Form.Item>



                    <Form.Item
                        label={"Sức chứa"}
                        name={"capacity"}
                        rules={[{ required: true, message: 'Vui lòng nhâp không gian phòng !' }]}
                    >
                        <InputNumber className='w-[100%]' min={1} placeholder='Nhập sức chứa' />
                    </Form.Item>

                    <Form.Item
                        label={"Số  lượng"}
                        name={"numberOfRooms"}
                        rules={[{ required: true, message: 'Vui lòng nhâp số lượng phòng !' }]}
                    >
                        <InputNumber className='inputnumber-room w-[30%]' max={100} min={1} placeholder='Nhập số lượng phòng' />
                    </Form.Item>

                    <Form.Item
                        label={"Số giường"}
                        name={"numberOfBeds"}
                        rules={[{ required: true, message: 'Vui lòng nhâp số lượng giường !' }]}
                    >
                        <InputNumber max={30} min={0} className='inputnumber-room w-[30%]' placeholder='Nhập số lượng giường' />
                    </Form.Item>

                    <Form.Item
                        min={1}
                        label={"Giá tiền"}
                        name={"money"}
                        rules={[{ required: true, message: 'Vui lòng nhập giá tiền !' }]}

                    >
                        <InputNumber
                            placeholder='Nhập giá tiền'
                            addonAfter={"VNĐ"}
                            formatter={(value) => {
                                if (!value) return '';
                                const numericValue = removeLettersAndReturnValue(value)
                                return formatMoney(numericValue)
                            }

                            }
                            parser={(value) => {
                                // Loại bỏ 'VNĐ' và các ký tự không phải số
                                return value.replace(/\s?VNĐ|[^0-9]/g, '');
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label={"Loại phòng"}
                        name={"typeOfRoom"}
                        rules={[{ required: true, message: 'Vui lòng nhâp tên loại phòng !' }]}
                    >
                        <Select options={typeRooms} placeholder='Nhập loại phòng' defaultValue={""} className='text-center' />
                    </Form.Item>
                    <Form.Item
                        label={"Thuộc khách sạn"}
                        name={"hotelID"}
                        rules={[{ required: true, message: 'Vui lòng chọn khách sạn !' }]}
                    >

                        <Select className=' w-[87%] text-center' options={option} />
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