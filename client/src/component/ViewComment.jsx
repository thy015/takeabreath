import React, { useEffect, useState } from 'react'
import { Modal, Card, Rate, Tag } from "antd"
import axios from 'axios'
import dayjs from 'dayjs'
import { openNotification } from '../hooks/notification'
function ViewComment({ visible, close, record }) {
    console.log(record)
    const [comment, setComment] = useState([])
    const BE_PORT=import.meta.env.VITE_BE_PORT
    useEffect(() => {
        if (record) {
            axios.get(`${BE_PORT}/api/hotelList/get-comment-room/${record._id}`)
                .then(res => res.data)
                .then(data => {
                    console.log(data)
                    setComment(data.comments)
                })
                .catch(err => {
                    openNotification(false, "Lấy dữ liệu thất bại !", err?.response?.data?.message ?? "")
                })
        }
    }, [record])
    return (
        <Modal
            title={"Đánh giá phòng " + record?.roomName}
            open={visible}
            onCancel={close}
        >
            {comment.length>0 ? 
            comment?.map(item => {
                return (
                    <Card
                        style={{ width: "100%", marginBottom: 16 }}
                        title={`Đánh giá từ ${item.cusID?.email}`}
                    >
                        <p><strong>Ngày đánh giá:</strong> {dayjs(item.createdDay).format("DD/MM/YYYY")}</p>
                        <p><strong>Email:</strong> {item.cusID?.email}</p>
                        <p><strong>Ngày sinh:</strong> {dayjs(item.cusID?.birthday).format("DD/MM/YYYY")}</p>
                        <p><strong>Điểm đánh giá:</strong> <Rate disabled value={item.ratePoint} /></p>
                        <p><strong>Nội dung:</strong> {item.content}</p>
                    </Card>
                );

            }):
            <h3>Hiện không có đánh giá</h3>
        
        }
        </Modal>
    )
}

export default ViewComment