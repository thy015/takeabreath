import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AudioOutlined } from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { Button, Table, Popconfirm, Typography, Space, Input } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CreateHotel } from '../../admin/Hotels/CreateHotel'
import { setHotels, deleteHotel, seletedHotel, searchHotels } from '../../../hooks/redux/hotelsSclice';
import axios from 'axios'
import { openNotification } from '../../../hooks/notification';

function Hotel() {
    const dispatch = useDispatch()
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const hotelSearch = useSelector(state => state.hotel.hotelSearch)
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        axios.get(`${BE_PORT}/api/hotelList/hotelOwner`)
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
            .catch(err => console.log("HOTEL", err))
    }, [])

    const handleDelete = (record) => {
        axios.delete(`${BE_PORT}/api/hotelList/deleteHotel/${record._id}`)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                openNotification(true, "Vô hiệu hóa khách sạn thành công !", "")
                dispatch(deleteHotel(record._id))
            })
            .catch(err => {
                openNotification(false, "Vô hiệu hóa khách sạn thất bại !", err.response?.data?.message ?? "")
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
            align:"center"
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
            align:"center"
        },

        {
            title: 'Số lượng sao',
            dataIndex: 'numberOfRates',
            key: 'numberOfRates',
            sorter: (a, b) => a.numberOfRates - b.numberOfRates,
            align:"center"
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
            sorter: (a, b) => a.revenue - b.revenue,
            align:"center"
        },
        ,
        {
            fixed: isMobile ? '' : 'right',
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
                                <Popconfirm title="Bạn có muốn vô hiệu hóa không" okText="Có" cancelText="Không" onConfirm={() => handleDelete(record)}>
                                    <p>Vô hiệu hóa</p>
                                </Popconfirm>
                            </Typography.Link>

                        </Space>
                    </>
                )
            }
        },
    ];

    const onSearch = (value, _e, info) => {
        dispatch(searchHotels(value))
    }
    return (
        <>
            <div className='h-full p-4'>
                <div className='flex flex-wrap  justify-between items-center py-4'>
                    <Link>
                        <Button
                            className={isMobile ? 'hidden':""}
                            onClick={() => setVisible(true)}
                            type='primary'
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Thêm khách sạn
                        </Button>
                        <Button
                            className={!isMobile ? 'hidden':""}
                            onClick={() => setVisible(true)}
                            type='primary'
                            icon={<FontAwesomeIcon icon={faPlus} />}
                        >
                        </Button>
                    </Link>
                    <Input.Search
                        placeholder='Tìm kiếm theo tên'
                        className='max-w-[200px] w-full md:w-auto '
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
                        className="min-w-full"
                    />
                </div>
                <CreateHotel
                    visible={visible}
                    handleCancel={() => {
                        setVisible(false);
                        dispatch(seletedHotel({}));
                    }}
                />
            </div>
        </>

    )
}

export default Hotel