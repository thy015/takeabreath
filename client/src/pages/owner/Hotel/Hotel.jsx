import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table, Popconfirm, Typography, Space } from 'antd'
import { useSelector,useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CreateHotel } from '../../admin/Hotels/CreateHotel'
import { setHotels,deleteHotel } from '../../../hooks/redux/hotelsSclice';
import axios from 'axios'
import { openNotification } from '../../../hooks/notification';

function Hotel() {
    const dispatch = useDispatch()
    const hotels = useSelector(state=>state.hotel.hotels)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        axios.get("http://localhost:4000/api/hotelList/hotelOwner")
            .then(res => res.data)
            .then(data => {
                dispatch(setHotels(data.data))
            })
            .catch(err => console.log(err))
    }, [])

    const handleDelete = (record)=>{
        axios.delete(`http://localhost:4000/api/hotelList/deleteHotel/${record._id}`)
            .then(res=>res.data)
            .then(data=>{
                dispatch(deleteHotel(record._id))
                openNotification(true,"Xóa khách sạn thành công !","")
            })
            .catch(err=>console.log(err))
    }

    const columns = [
        {
            title: 'Tên khách sạn',
            dataIndex: 'hotelName',
            key: 'hotelName',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Số lượng phòng',
            dataIndex: 'numberOfRooms',
            key: 'numberOfRooms',
            sorter: (a, b) => a.numberOfRooms - b.numberOfRooms,
        },

        {
            title: 'Quốc gia',
            dataIndex: 'nation',
            key: 'nation',
        },

        {
            title: 'Thành phố',
            dataIndex: 'city',
            key: 'city',
        },

        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNum',
            key: 'phoneNum',
        },

        {
            title: 'Số lượng sao',
            dataIndex: 'numberOfRates',
            key: 'numberOfRates',
            sorter: (a, b) => a.numberOfRates - b.numberOfRates,

        },

        {
            title: 'Loại khách sạn',
            dataIndex: 'hotelType',
            key: 'hotelType',
        },
        {
            title: 'Số lượng đã đặt',
            dataIndex: 'revenue',
            key: 'revenue',
        },
        ,
        {
            fixed: 'right',
            title: 'Action',
            width: 200,
            dataIndex: 'revenue',
            key: 'revenue',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <Typography.Link  >
                                <p>Cập nhật</p>
                            </Typography.Link>
                            <Typography.Link >
                                <Popconfirm title="Bạn có muốn xóa không" okText="Có" cancelText="Không" onConfirm={()=>handleDelete(record)}>
                                    <p>Xóa</p>
                                </Popconfirm>
                            </Typography.Link>

                        </Space>
                    </>
                )
            }
        },
    ];

    return (
        <>
            <div className='h-full '>
                <div className='max-w-[170px] text-left p-[20px]'>
                    <Link>
                        <Button
                            onClick={() => setVisible(true)}
                            type='primary'
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Thêm khách sạn
                        </Button>
                    </Link>
                </div>
                <div>
                    <Table
                        bordered
                        dataSource={hotels}
                        columns={columns}
                        scroll={{
                            x: 'max-content',
                        }}
                    >

                    </Table>
                </div>
            </div>
            <CreateHotel visible={visible} handleCancel={()=>setVisible(false)}></CreateHotel>
        </>

    )
}

export default Hotel