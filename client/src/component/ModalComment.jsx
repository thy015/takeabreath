import { Modal, Form, Input, Rate } from 'antd'
import axios from 'axios'
import React from 'react'
import { openNotification } from '../hooks/notification'

function ModalComment({ open, close, selectedInvoice,setDisable }) {
    console.log(selectedInvoice)
    const [form] = Form.useForm()

    const hanldeOke = () => {
        form.submit()
    }

    const onFinish = (values) => {
        const { content, ratePoint } = values
        axios.post("http://localhost:4000/api/hotelList/commentRoom",{
            content,
            ratePoint,
            roomID:selectedInvoice.roomInfo._id,
            invoiceID:selectedInvoice.invoiceInfo._id
        })
        .then(res=>res.data)
        .then(data=>{
            openNotification(true,data.message,"")
            setDisable(false)
            close()
        })
        .catch(err=>{
            openNotification(false,"Đánh giá thất bại",err.response?.data?.message)
        })
    }

    return (
        <Modal
            title={(<h3> Khách sạn { selectedInvoice.hotelInfo?.hotelName ?? ""}</h3> )}
            open={open}
            onCancel={close}
            okText="Xác nhận"
            cancelText="Trở lại"
            onOk={hanldeOke}
        >
            <>
                <h4>Đánh giá phòng {selectedInvoice.roomInfo?.roomName}</h4>
                <Form
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="Số sao"
                        name={"ratePoint"}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item
                        label="Chi tiết đánh giá"
                        name={"content"}
                    >
                        <Input.TextArea maxLength={100} />
                    </Form.Item>
                </Form>
            </>

        </Modal>
    )
}

export default ModalComment