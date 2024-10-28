import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AudioOutlined } from '@ant-design/icons';
import { Button, Table, Popconfirm, Typography, Space, Input } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CreateHotel } from '../../admin/Hotels/CreateHotel'
import { setHotels, deleteHotel, seletedHotel,searchHotels } from '../../../hooks/redux/hotelsSclice';
import axios from 'axios'
import { openNotification } from '../../../hooks/notification';

function Hotel() {
    const dispatch = useDispatch()
    const hotels = useSelector(state => state.hotel.hotels)
    const hotelSearch = useSelector(state=>state.hotel.hotelSearch)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        axios.get("http://localhost:4000/api/hotelList/hotelOwner")
            .then(res => res.data)
            .then(data => {
                console.log(data)
                const hotels = data.data.map((item => (
                    {
                        ...item,
                        key: item._id
                    }
                )))
                dispatch(setHotels(hotels))
            })
            .catch(err => console.log("HOTEL",err))
    }, [])

    const handleDelete = (record) => {
        axios.delete(`http://localhost:4000/api/hotelList/deleteHotel/${record._id}`)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                openNotification(true, "Xóa khách sạn thành công !", "")
                dispatch(deleteHotel(record._id))
            })
            .catch(err =>{
                openNotification(false,err.response.data.m)
            })
    }

    const handleUpdate = (record) => {
        console.log(record)
        dispatch(seletedHotel(record))
        setVisible(true)
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
            sorter: (a, b) => a.revenue - b.revenue
        },
        ,
        {
            fixed: 'right',
            title: 'Action',
            width: 200,
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <>
                        <Space>
                            <Typography.Link onClick={() => handleUpdate(record)} >
                                <p>Cập nhật</p>
                            </Typography.Link>
                            <Typography.Link >
                                <Popconfirm title="Bạn có muốn xóa không" okText="Có" cancelText="Không" onConfirm={() => handleDelete(record)}>
                                    <p>Xóa</p>
                                </Popconfirm>
                            </Typography.Link>

                        </Space>
                    </>
                )
            }
        },
    ];

    const onSearch = (value, _e, info) =>{
        dispatch(searchHotels(value))
    }

    const suffix = (
        <AudioOutlined
          style={{
            fontSize: 16,
            color: '#1677ff',
          }}
        />
      );
    return (
        <>
            <div className='h-full '>
                <div className='w-full text-left py-[20px] px-[40px] d-flex justify-between items-center'>
                    <Link>
                        <Button
                            onClick={() => setVisible(true)}
                            type='primary'
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Thêm khách sạn
                        </Button>
                    </Link>
                    <Input.Search  
                        placeholder='Tim kiếm theo tên'
                        className='max-w-[200px]'
                        allowClear
                        enterButton
                        onSearch={onSearch}
                    />
                </div>
                <div>
                    <Table
                        bordered
                        dataSource={hotelSearch}
                        columns={columns}
                        scroll={{
                            x: 'max-content',
                        }}
                    >

                    </Table>
                </div>
            </div>
            <CreateHotel
                visible={visible}
                handleCancel={() => {
                    setVisible(false)
                    dispatch(seletedHotel({}))
                }}
            ></CreateHotel>
        </>

    )
}

export default Hotel