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
        console.log(values.date)
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
        axios.post("http://localhost:4000/api/voucher/add-voucher",voucher)
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
        <div className='my-[10px] mx-[20px] d-flex flex-col justify-center items-center'>
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
                    className='items-center h-full w-[600px]'
                    labelCol={{
                        span: 8
                    }}
                    labelAlign='left'
                    form={formVoucher}
                    onFinish={onFinish}
                    validateMessages={message}
                >
                    <FormItem

                        label="Voucher name "
                        name="voucherName"
                        rules={[
                            {
                                required: true,
                                message: "Please input voucher name!"
                            }
                        ]}
                    >
                        <Input className='w-[500px] px-[10px] input-addvoucher' placeholder='Enter voucher name' />
                    </FormItem>


                    <FormItem

                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: "Please input discount!"
                            }
                        ]}
                    >
                        <InputNumber
                            min={0} max={50}
                            type='number' addonAfter="%"
                            className='w-[500px] input-addvoucher'
                            placeholder='Enter discount ( More than 50% )' />
                    </FormItem >



                    <FormItem
                        className='items-start'
                        label="Date Start & Date End "
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: "Please input discount!"
                            },
                        ]}
                        validateStatus='error'

                    >
                        <DatePicker.RangePicker status={status} className='range-picker-addvoucher w-[500px] px-[10px] input-addvoucher' />
                    </FormItem>
                    <FormItem
                        label="Code "
                        name="code"
                    >
                        <Input
                            maxLength={5}
                            className='w-[500px] px-[10px] input-addvoucher'
                            placeholder='Please enter code (If not, it will be automatic)' />
                    </FormItem>
                    <div className='d-flex justify-end items-center' >
                        <Link to="/Owner/Vouchers" className='mr-[20px]'>
                            <FontAwesomeIcon icon={faCaretLeft} className='mr-[5px]' />
                            Back
                        </Link>
                        <Button
                            className='p-[10px]'
                            type='primary'
                            htmlType='submit'
                        >Add Voucher</Button>

                    </div>
                </Form>
            </ConfigProvider>

        </div>
    )
}

export default AddVoucher