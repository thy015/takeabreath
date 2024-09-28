import React from 'react'
import axios from "axios"
import { Form, Input, Button, Calendar, DatePicker, InputNumber } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import { openNotification } from "../../hooks/notification";
function RegisterOwner() {
    const navigate = useNavigate()
    const [form] = useForm()
    const onFinish = (values) => {
        const formattedDate = values.birthday.format('YYYY/MM/DD');
        values.birthday = formattedDate
        axios.defaults.withCredentials=true
        axios.post("http://localhost:4000/api/auth/signUpOwner",values)
            .then(res=>res.data)
            .then(data=>{
                if(data.register){
                    openNotification(true,"Register owner successful!","")
                    navigate('/loginOwner')
                }
            })
            .catch(err=>{
                console.log("[REGISTER OWNER]",err)
                openNotification(false,"Register owner failed!",err?.response?.data?.message ?? "No response")
            })

    }
    return (
        <>
            <div className='h-screen w-full d-flex justify-center  align-items-center '>
                <Form
                    className='w-[700px] h-[650px] border-black border-1 rounded-[20px] '
                    form={form}
                    onFinish={onFinish}
                >
                    <h2 className='m-[40px] font-bold'>RegisterOwner</h2>
                    <Form.Item
                        className='m-[30px] mt-[40px] register-owner'
                        name="ownerName"
                        label="Name Owner"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your nickname!',
                                whitespace: true,
                            },
                        ]}
                    >
                        <Input className=''/>
                    </Form.Item>
                    <Form.Item         
                        className='m-[30px] mt-[40px] register-owner'
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        className='m-[30px] mt-[40px] register-owner'
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        className='m-[30px] mt-[40px] register-owner'
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The new password that you entered do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        className='m-[30px] mt-[40px] register-owner'
                        name="phone"
                        label="Phone Number"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                            },
                        ]}
                    >
                        <Input
                      
                            count={{
                                show: true,
                                max: 10,

                            }}
                            type='number'
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="birthday"
                        className='m-[30px] mt-[40px] register-owner'
                        label="Birthday"
                        rules={[
                            {
                                required:true,
                                message:"Please select your birthday"
                            }
                        ]}
                    >
                        <DatePicker name="birthday" className="w-full" placeholder='Select birthday' format={(value)=>(
                            value.format('YYYY/MM/DD'))} />
                    </Form.Item>
                    <Form.Item className='m-[30px] mt-[40px] register-owner'>
                       
                        <Button type="primary" htmlType="submit" className='w-full h-[50px] m-[10px] font-bold text-[20px]'>
                            Register
                        </Button>
                    </Form.Item>
                </Form>

            </div >
        </>
    )
}

export default RegisterOwner