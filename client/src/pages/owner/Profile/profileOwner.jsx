import React, { useContext, useEffect, useState } from 'react';
import { Card, Avatar, Typography, Button, Modal, Form, Input, Descriptions, DatePicker, InputNumber, Image } from 'antd';
import { AuthContext } from '../../../hooks/auth.context';
import axios from 'axios';
import dayjs from 'dayjs';
import { openNotification } from '../../../hooks/notification';
import { useDispatch } from 'react-redux';
import { setOwner } from '../../../hooks/redux/ownerSlice';
const { Title, Text } = Typography;

const UserInfoCard = () => {
    const dispatch = useDispatch()
    const BE_PORT = import.meta.env.VITE_BE_PORT
    const [visible, setVisible] = useState(false);
    const [image, setImage] = useState("https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg")
    const [editingField, setEditingField] = useState(null);
    const [form] = Form.useForm();
    const [user, setUser] = useState({})
    const { auth, setAuth } = useContext(AuthContext)
   
    useEffect(() => {
        axios.get(`${BE_PORT}/api/auth/get-owner`)
            .then(res => res.data)
            .then(data => {
                setUser(data.owner)
                dispatch(setOwner(data.owner))
                form.setFieldsValue({
                    ownerName: data.owner.ownerName ?? "",
                    birthday:dayjs( data.owner.birthday) ?? "",
                    email: data.owner.email ?? "",
                    idenCard: data.owner.idenCard ?? "",
                    phoneNum:data.owner.phoneNum ?? ""
                });
                setImage(data.owner.avatarLink ?? [])
            })
            .catch(err => {
                console.log(err)
            })
    }, [visible])
    const showModal = (field) => {
        setEditingField(field);
        setVisible(true);
        form.setFieldsValue({ [field]: user[field] });
    };

    const isAgeAbove16 = (birthday) => {
        // Kiểm tra nếu ngày sinh không hợp lệ
        if (!birthday || !dayjs(birthday, 'YYYY/MM/DD', true).isValid()) {
            return false;
        }

        const age = dayjs().diff(dayjs(birthday, 'YYYY/MM/DD'), 'year');
        return age > 16;
    };

    const handleOk = () => {
        form.submit()
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const onFinish = (values) => {
        const { birthday, phoneNum, email, idenCard } = values
        const stringPhone = phoneNum.toString()
        const idenCardString = idenCard.toString()
        if (!isValidEmail(email)) {
            openNotification(false, "Email đúng dạng ", "")
            return

        }
        if (!isAgeAbove16(birthday)) {
            openNotification(false, "Ngày sinh phải trên 16 tuổi", "")
            return
        }
        if (stringPhone.length != 10) {
            openNotification(false, "Số điện thoại phải đủ 10 chữ số", "")
            return
        }
        if (idenCardString.length != 12) {
            openNotification(false, "Số chứng minh phải đủ 12 chữ số", "")
            return
        }


        const newData = {
            ...values,
            birthday:dayjs(birthday).format('YYYY/MM/DD'),
            avatarLink: image
        }
        axios.post(`${BE_PORT}/api/auth/update-owner/${auth.user.id}`, { newData})
            .then(res => res.data)
            .then(data => {
                setVisible(false);
                setUser(newData)
                dispatch(setOwner(newData))
                openNotification(true, "Cập nhật thành công", "")
            })
            .catch(err => {
                console.log(err)
                openNotification(false, "Cập nhật thất bại", "")

            })
    }

    const handleCancel = () => {
        setVisible(false);
    };

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
         
            setImage(uploadedImageURL.url)
        }
    }

    const handleDelete = async (item) => {

        setImage("https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg")
    }

    return (
        <div className="bg-gray-100 min-h-screen flex justify-center items-center">
            <Card
                className="w-full max-w-lg shadow-lg rounded-lg "
                title={
                    <div className="flex items-center mx-[20px] mt-[20px]">
                        {console.log(image)}
                        <Avatar
                            src={image.length> 0  ? image: "https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg"}
                            size={64}
                            className="mr-4 border border-blue-500"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {user.ownerName}
                            </h2>
                            <p className="text-base text-gray-500">{user.email}</p>
                        </div>
                    </div>
                }
            >
                {/* User Information */}
                <Descriptions
                    column={1}
                    bordered
                    className="bg-white rounded-lg overflow-hidden"
                    labelStyle={{ fontWeight: "bold", width: "150px", fontSize: '20px' }} // Change label size
                    contentStyle={{ color: "gray", fontSize: '20px' }} // Change content size
                >
                    <Descriptions.Item label="Ngày sinh">
                        {user.birthday || "Không có thông tin"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                        {user.phoneNum}
                    </Descriptions.Item>
                    <Descriptions.Item label="CMND/CCCD">
                        {user.idenCard}
                    </Descriptions.Item>
                </Descriptions>

                {/* Edit Button */}
                <div className="mt-6 text-center">
                    <Button
                        type="primary"
                        size="large"
                        onClick={showModal}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        Chỉnh sửa thông tin
                    </Button>
                </div>
            </Card>


            <Modal
                okText="Chỉnh sửa"
                cancelText="Trở lại"
                title={(<p className='text-[17px] font-bold'>Chỉnh sửa thông tin cá nhân</p>)}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
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
                >
                    <Form.Item name="ownerName" label="Tên" rules={[{ required: true, message: 'This field is required!' }]}>
                        <Input type='email' />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'This field is required!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="birthday" label="Ngày sinh">
                        <DatePicker className=' w-full' />
                    </Form.Item>
                    <Form.Item name="phoneNum" label="Số điện thoại" rules={[{ required: true, message: 'This field is required!' }]}>
                        <InputNumber maxLength={10} minLength={10} className=' w-full' type='number' />
                    </Form.Item>
                    <Form.Item name="idenCard" label="CCCD" rules={[{ required: true, message: 'This field is required!' }]}>
                        <InputNumber maxLength={12} className=' w-full' type='number' />
                    </Form.Item>
                    <Form.Item name="avatarLink" label="Avatar Link">
                        <Input type='file' onChange={handleImage} />
                    </Form.Item>
                    <div className='flex justify-center'>
                        <div className="relative inline-block overflow-hidden ">
                            <Image src={image} className="object-cover rounded-md " alt="item" />
                            <button
                                className="absolute top-1 right-1 bg-red-500 text-center items-center text-white rounded-full p-1 w-[20px] h-[20px] flex justify-center"
                                onClick={() => handleDelete(image)}
                            >
                                x
                            </button>
                        </div>
                    </div>

                </Form>
            </Modal>
        </div>);
};

export default UserInfoCard



