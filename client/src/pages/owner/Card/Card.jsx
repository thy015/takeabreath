import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, Popconfirm, Table } from 'antd'
import { Link } from 'react-router-dom'
import FormCard from '../../../component/FormCard'
import dayjs from 'dayjs'
import axios from 'axios'
import { setCards, addCards } from '../../../hooks/redux/cardSlice'
import { openNotification } from '../../../hooks/notification'
function Card() {
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false)
    const cards = useSelector(state => state.card.cards)

    useEffect(() => {
        axios.get("http://localhost:4000/api/auth/list-card")
            .then(res => res.data)
            .then(data => {
                const cards = data.cards.map((item) => (
                    {
                        ...item,
                        key: item._id
                    }
                ))

                dispatch(setCards(cards))
            })
            .catch(err => {
                openNotification(false, "Không có thẻ", "")
            })

    }, [])

    const handleDelete = (record)=>{
        axios.post("http://localhost:4000/api/auth/delete-card",{numberCard:record.cardNumber})
        .then(res=>res.data)
        .then(data=>{
            openNotification(true,"Gỡ thẻ thành công","")
            const cards = data.cards.map((item) => (
                {
                    ...item,
                    key: item._id
                }
            ))

            dispatch(setCards(cards))
        })
        .catch(err=>{
            openNotification(false,"Gỡ thẻ không thành công")
        })
    }

    const columns = [
        {
            title: 'Loại thẻ',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Số thẻ',
            dataIndex: 'cardNumber',
            key: 'cardNumber',
        },
        {
            title: 'Số CVV',
            dataIndex: 'cardCVV',
            key: 'cardCVV',
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'cardExpiration',
            key: 'cardExpiration',
            render: (text) => dayjs(text).format("DD/MM/YYYY")
        }, ,
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm okText="Xác nhận" cancelText="Trở lại" onConfirm={()=>handleDelete(record)} title="Bạn có chắc gỡ thẻ không ?">
                    <Button danger >
                        Gỡ thẻ
                    </Button>
                </Popconfirm>

            )
        },
    ]
    return (
        <div className='h-full '>
            <div className='max-w-[170px] text-left p-[20px]'>
                <Link >
                    <Button
                        onClick={() => setVisible(true)}
                        type='primary'
                        icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Thêm thẻ
                    </Button>
                </Link>
            </div>
            <Table columns={columns} dataSource={cards}></Table>
            <FormCard visible={visible} close={() => setVisible(false)}></FormCard>
        </div>
    )
}

export default Card