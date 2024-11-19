import React from 'react'
import { useDispatch } from "react-redux"
import { Modal, Form, Input, InputNumber, DatePicker, Col, Row } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import axios from "axios"
import  {setCards} from '../hooks/redux/ownerSlice'
import { openNotification } from '../hooks/notification'

function FormCard({ visible, close }) {
    const dispatch = useDispatch()
    const [form ] = useForm()
    const onFinish = (value) => {
        const {numberCard,cvv,expDay} = value
        const currentDay = dayjs()
        const BE_PORT=import.meta.env.VITE_BE_PORT
        console.log(numberCard.length)
        if(numberCard.length !== 16){
            openNotification(false,"Số thẻ phải đủ 16 số","")
            return
        }
        if( expDay.isBefore(currentDay)){
            openNotification(false,"Ngày hết hạn phải ở tương lai","")
            return
        }
        
        // thời hạn thẻ phải ít nhất 1 năm 
        if(!expDay.isAfter(currentDay.add(1, "year"))){
            openNotification(false,"Ngày hết hạn ít nhất là 1 năm sau","")
            return
        }
        
        axios.post(`${BE_PORT}/api/auth/insert-card`,{numberCard,cvv,expDay})
            .then(res=>res.data)
            .then(data=>{
                dispatch(setCards(data.cards))
                openNotification(true, data.message,"")
                close()
            })
            .catch(err=>{
                console.log(err)
                openNotification(false,"Thêm thẻ không thành công",err.response?.data?.message??"")
            })
    }


    return (
        <Modal
            open={visible}
            title={(<p className='font-bold text-[20px]'>Thêm thẻ</p>)}
            okText="Thêm thẻ"
            cancelText="Quay lại"
            onOk={()=>{form.submit()}}
            onCancel={close}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="horizontal"
                labelAlign='lefts'
            >
                <Form.Item
                    label="Nhập số thẻ"
                    name="numberCard"
                    maxLength= {16}
                    rules={
                        [
                            {
                                required:true,
                                message:"Vui lòng nhập số thẻ"
                            }
                        ]
                    }
                >
                    <Input className='ml-[7px]' placeholder='Nhập số thẻ' />
                </Form.Item>
                <Row>
                    <Col span={14} >
                        <Form.Item
                            label="Ngày hết hạn"
                            name={"expDay"}
                            rules={
                                [
                                    {
                                        required:true,
                                        message:"Vui lòng nhập ngày hết hạn"
                                    }
                                ]
                            }
                        >
                            <DatePicker />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item
                            labelCol={{
                                span: 14
                            }}
                            label="Số CVV"
                            name={"cvv"}
                            rules={
                                [
                                    {
                                        required:true,
                                        message:"Vui lòng nhập số CVV"
                                    }
                                ]
                            }
                        >
                            <InputNumber maxLength={3} placeholder='Nhập CVV' />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        </Modal>
    )
}

export default FormCard