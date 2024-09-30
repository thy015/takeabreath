import { Form, Input, ConfigProvider, DatePicker, Button, InputNumber } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
const FormVoucher=({record})=> {

    const [form] = useForm()
    const [status, setStatus] = useState("normal")
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const onFinish = (values)=>{
        console.log(values)
    }
    axios.defaults.withCredential = true
    return (
        <div className='my-[10px] mx-[20px] d-flex flex-col justify-center items-center'>
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
                    className='items-center h-full w-full'
                    labelCol={{
                        span: 8
                    }}
                    form={form}
                    labelAlign='left'  
                    onFinish={onFinish}
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
                        {console.log("[INPUT VOUCHER]",record.voucherName)}
                        <Input className=' px-[10px] input-addvoucher'  placeholder={record.voucherName} />
                   
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
                            className='input-addvoucher'
                            placeholder='Enter discount ( More than 50% )' />
                    </FormItem >



                    <FormItem
                        className='items-start'
                        label="Date Start & End "
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: "Please input discount!"
                            },
                        ]}
                        validateStatus='error'

                    >
                        <DatePicker.RangePicker status={status} className='range-picker-addvoucher  px-[10px] input-addvoucher' />
                    </FormItem>
                    <FormItem
                        label="Code "
                        name="code"
                    >
                        <Input
                            maxLength={5}
                            className='px-[10px] input-addvoucher'
                            placeholder='Please enter code (If not, it will be automatic)' />
                    </FormItem>
                    <Button
                            className='p-[10px]'
                            type='primary'
                            htmlType='submit'
                        >Add Voucher</Button>
                </Form>
            </ConfigProvider>
            <input value={record.voucherName}/>
        </div>
    )
}

export default FormVoucher