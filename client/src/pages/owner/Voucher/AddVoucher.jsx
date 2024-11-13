import { Form, Input, ConfigProvider, DatePicker, Button, InputNumber } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import { openNotification } from '../../../hooks/notification'
import axios from "axios"
function AddVoucher() {
    const [formVoucher] = useForm()
    const [status, setStatus] = useState("normal")
    const [message, setMessage] = useState("")
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const BE_PORT=import.meta.env.VITE_BE_PORT
    axios.defaults.withCredential=true
    function generateRandomString(length) {
        let
            result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;

    }
    //Fetch data 
    const onFinish = (values) => {
        const dateVoucher = values.date
        const stringDateStart = dateVoucher[0].format('YYYY/MM/DD')
        const stringDateEnd = dateVoucher[1].format('YYYY/MM/DD')
        const dateStart = new Date(stringDateStart)
        const dateEnd = new Date(stringDateEnd)
        const dateLast = dateEnd.getDate() - dateStart.getDate()
        if (dateEnd.getMonth() == dateStart.getMonth()) {
            if (dateLast < 2) {
                openNotification(false,"Add voucher fail","Voucher must be valid for at least 2 days !")
                setStatus("error")
                return
            }
        }
        setMessage("")
        setStatus("normal")
        let code = values.code
        if (code === "" || !code) {
            code = generateRandomString(5)
        }
        const voucher ={
            voucherName : values.voucherName,
            discount: values.discount,
            dateStart: stringDateStart,
            dateEnd: stringDateEnd,
            code : code,
        }
        axios.post(`${BE_PORT}/api/voucher/add-voucher`,voucher)
            .then(res=>res.data)
            .then(data =>{
                openNotification(data.status,"Add voucher successful !" ,"")
                console.log(data)
            })
            .catch((e)=>{
                openNotification(false,"Add voucher failed",e.response.data.message)
                console.log(e)
            })
        

    }

    //Form addvoucher
    return (
        <div className='my-[10px] mx-[20px] flex flex-col items-center'>
        <h2 className='mt-[30px] mb-[50px] font-bold'>Add Voucher</h2>
        <ConfigProvider
            theme={{
                token: {
                    colorText: "black",
                    fontSize: "17px",
                    colorTextDescription: "black"
                }
            }}
        >
            <Form
                className='w-full max-w-[600px]' // Use full width with a max limit
                labelCol={{ span: 24 }} // Make labels full width
                wrapperCol={{ span: 24 }} // Make inputs full width
                layout="vertical" // Use vertical layout for better stacking
                onFinish={onFinish}
            >
                <Form.Item
                    label="Voucher name"
                    name="voucherName"
                    rules={[{ required: true, message: "Please input voucher name!" }]}
                >
                    <Input className='input-addvoucher' placeholder='Enter voucher name' />
                </Form.Item>

                <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: "Please input discount!" }]}
                >
                    <InputNumber
                        min={0} max={50}
                        type='number' addonAfter="%"
                        className='input-addvoucher w-full'
                        placeholder='Enter discount ( Less than 50% )' />
                </Form.Item>

                <Form.Item
                    label="Date Start & Date End"
                    name="date"
                    rules={[{ required: true, message: "Please select date!" }]}
                >
                    <DatePicker.RangePicker className='input-addvoucher w-full' />
                </Form.Item>

                <Form.Item
                    label="Code"
                    name="code"
                >
                    <Input
                        maxLength={5}
                        className='input-addvoucher'
                        placeholder='Please enter code (If not, it will be automatic)' />
                </Form.Item>

                <Form.Item>
                    <div className='flex justify-between items-center'>
                        <Link to="/Owner/Vouchers" className='mr-[20px] flex items-center'>
                            <FontAwesomeIcon icon={faCaretLeft} className='mr-[5px]' />
                            Back
                        </Link>
                        <Button
                            className='p-[10px]'
                            type='primary'
                            htmlType='submit'
                        >
                            Add Voucher
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </ConfigProvider>
    </div>
    )
}

export default AddVoucher