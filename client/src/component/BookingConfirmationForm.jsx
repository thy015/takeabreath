import React, { useEffect, useLayoutEffect, useState, useContext } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import { Modal, Col, Row, Form, Input, ConfigProvider, Select, Button, DatePicker, Radio, Rate } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { useForm } from 'antd/es/form/Form'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useSelector } from "react-redux";
import FormPayment from '../component/FormPayment'
import { AuthContext } from "../hooks/auth.context";
function BookingConfirmationForm({ isShow, onCancel, room, hotel, count, totalPrice }) {
    const { auth } = useContext(AuthContext)
    const [form] = useForm()
    const [payment, setPayment] = useState('')
    const rateCal = (rate) => {
        if (rate >= 4.8) {
            return 5;
        } else if (rate >= 4.0) {
            return 4;
        } else if (rate > 3.5) {
            return 3;
        } else if (rate > 2.5) {
            return 2;
        } else return 1;
    };
    const handleOke = () => {
        form.submit()
    }
    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
      }
    const { dayStart, dayEnd, totalCheckInDay } = useSelector((state) => state.inputDay)
    const onFinish = (values) => {
        const idHotel = hotel._id
        const idRoom = room._id
        const idCus = auth.user.id ?? "Chua login"
        const dataBooking = {
            inputName: values.fullname,
            inputCccd: values.cccd,
            inputGender:values.gender,
            paymentMethod: values.paymentMethod,
            inputPhoneNum: values.numberphone,
            inputEmail: values.email,
            inputCardData: {
                numberCart: values.numberCard ?? values.phonepayment,
                CVV: values.cvv ?? null
            },
            inputDob: dayjs(values.dob).format("DD/MM/YYYY"),
            total:totalPrice,
            checkInDay:dayStart,
            checkOutDay:dayEnd,
            totalDay: totalCheckInDay
        }

        console.log("[INFORMATION BOOKING]",idHotel,idCus,idRoom,dataBooking)
    }

    return (
        <div >
            <Modal
                open={isShow}
                onCancel={onCancel}
                className='min-w-[80%] max-h-[100px]'
                okText="Confirm Booking"

                onOk={handleOke}
            >
                <h2 className='text-center font-bold'>Booking Detail</h2>
                <Row className='h-[520px] ' wrap={true}>
                    {/* input form */}
                    <Col span={16} className='border-[1px] p-[10px] h-[520px] border-gray-300 rounded-[10px] min-w-[550px]'>
                        <h3 className='text-center mt-[18px]  mb-[29px]'>Enter your details</h3>
                        <ConfigProvider
                            theme={{
                                components: {
                                    Form: {
                                        labelColor: "black"
                                    },
                                },
                            }}
                        >
                            <div style={{ overflowY: 'auto', height: '400px' }}>
                                <Form
                                    scrollToFirstError={true}
                                    onFinish={onFinish}
                                    labelCol={{
                                        span: 8
                                    }}
                                    labelAlign='left'
                                    form={form}
                                    className='w-[550px] h-[500px] mr-[34px] ml-[28px] '
                                >
                                    <FormItem
                                        label="Fullname"
                                        name="fullname"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your fullname !s"
                                            }
                                        ]}
                                    >
                                        <Input className='min-w-[150px]' />
                                    </FormItem>
                                    <FormItem
                                        label="Identification Card"
                                        name="cccd"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your CCCD !"
                                            }
                                        ]}
                                    >
                                        <Input className='min-w-[150px]' />
                                    </FormItem>
                                    <FormItem
                                        label="Email"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your email !"
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </FormItem>

                                    <FormItem
                                        label="Phone Number"
                                        name="numberphone"
                                        maxLength={10}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please input your numberphone !"
                                            }
                                        ]}
                                    >
                                        <PhoneInput
                                            defaultMask='... ... ... .'
                                            enableLongNumbers={false}
                                        >

                                        </PhoneInput>
                                    </FormItem>

                                    <FormItem
                                        name="dob"
                                        label="Select birthday"
                                    >
                                        <DatePicker className='ml-[10px]' />
                                    </FormItem>

                                    <FormItem
                                        name="gender"
                                        label="Select gender"
                                    >
                                        <Radio.Group className='ml-[10px]'>
                                            <Radio value='male'>Male</Radio>
                                            <Radio value='female'>Female</Radio>
                                        </Radio.Group>
                                    </FormItem>

                                    <FormItem
                                        name="paymentMethod"
                                        label="Select payment method"
                                    >
                                        <Radio.Group className='ml-[10px]'>
                                            <Radio value='visa' onClick={() => { setPayment('visa') }}>Visa</Radio>
                                            <Radio value='momo' onClick={() => { setPayment('momo') }}>Momo</Radio>
                                        </Radio.Group>
                                    </FormItem>
                                    <FormPayment paymentMethod={payment} />

                                    <FormItem
                                        name="voucher"
                                        label="Select voucher"
                                        className='mb-[10px]'
                                    >
                                        <Select>
                                            <Option key='1' value="Voucher 1 ">Voucher 1</Option>
                                            <Option key='2' value="Voucher 2">Voucher 1</Option>
                                            <Option key='3' value="Voucher 3">Voucher 1</Option>

                                        </Select>
                                    </FormItem>
                                </Form>
                            </div>
                        </ConfigProvider>

                    </Col>
                    {/* information*/}
                    <Col span={8} >
                        <Row className='d-flex justify-center items-center'>
                            {/* information hotel */}
                            <Col span={24} className=' mb-[25px] p-[10px] h-[170px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]'>
                                <p className='text-[15px] mb-[5px]  mt-[2px]' >
                                    Hotel
                                    <span className='ml-[10px]'>
                                        <Rate disabled defaultValue={rateCal(hotel.rate)}></Rate>
                                    </span>
                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    <b>{hotel.hotelName}</b>
                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    {hotel.address}
                                </p>
                                <div className='mb-[5px]'>
                                    <span className='mr-[20px]'>
                                        Nation: {hotel.nation}
                                    </span>
                                    <span >
                                        City: {hotel.city}
                                    </span>

                                </div>
                                <p>
                                    Phone: {hotel.phoneNum}
                                </p>

                            </Col>
                            {/* information rooms */}
                            <Col span={24} className='h-[150px] mb-[25px] p-[10px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]' >
                                <p className='text-[15px] mb-[5px]  mt-[2px]' >
                                    Room for {room.capacity} people

                                </p>
                                <p className='text-[16px] mb-[5px]'>
                                    <b>{room.roomName}</b>
                                </p>

                                <div className='mb-[5px]'>
                                    <span className='mr-[20px]'>
                                        Type of room: {room.typeOfRoom}
                                    </span>
                                    <span>
                                        Beds: {room.numberOfBeds}
                                    </span>
                                </div>
                                <p>
                                    Room price: {room.money} VND
                                </p>

                            </Col>
                            {/* information booking */}
                            <Col span={24} className='h-[150px] border-[1px] p-[10px] max-w-[90%] border-gray-300 rounded-[10px] mb-[25px]'>
                                <Row className='mb-[5px] max-h-[45px]'>
                                    <Col span={11} className='border-r-[1px] border-y-slate-400 mr-[11px]'>
                                        Check In
                                        <p>
                                            <b> {dayjs(dayStart).format('DD/MM/YYYY')}</b>
                                        </p>
                                    </Col>

                                    <Col span={12} >
                                        Check Out
                                        <p>
                                            <b>{dayjs(dayEnd).format('DD/MM/YYYY')}</b>
                                        </p>
                                    </Col>
                                </Row>
                                <div className='mb-[5px]'>
                                    {/* You select {count} rooms */}
                                </div>
                                <div className='mb-[5px]'>
                                    <b>Total length of day: </b> {totalCheckInDay} days
                                </div>
                                <div className='mb-[5px]'>
                                    <b>Total room: </b> {count ?? "1"} rooms
                                </div>
                                <div className='mb-[5px]'>
                                    <b>Total price: </b> {formatMoney(totalPrice)} VND
                                </div>
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default BookingConfirmationForm