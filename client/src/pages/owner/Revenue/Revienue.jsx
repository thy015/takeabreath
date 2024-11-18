import React, { useEffect, useMemo, useState } from 'react'
import { Col, Row, DatePicker, Button, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { setInvoices, getInvoicesDay } from "../../../hooks/redux/revenueSlice"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHotel, faBed, faReceipt, faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons"
import dayjs from 'dayjs'
import axios from 'axios'
import MetricCard from './MetricCard'
import ChartRevenue from './Chart'
function Revienue() {
    const dispatch = useDispatch()
    const [countHotel, setCountHotel] = useState(0)
    const [countRoom, setCountRoom] = useState(0)
    const [countInvoice, setCountInvoice] = useState(0)
    const [totalDefauld, setTotal] = useState(0)
    const invoices = useSelector(state => state.invoiceRevenue.invoices)
    const invoicesSearch = useSelector(state => state.invoiceRevenue.invoicesSearch)
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const formatDay = (day) => {
        return dayjs(day).format("DD/MM/YYYY")
    }
    useEffect(() => {
        axios.get(`${BE_PORT}/api/hotelList/list-invoice-owner`)
            .then(res => res.data)
            .then(data => {
                console.log(data)
                setCountHotel(data.countHotel)
                setCountRoom(data.countRoom)
                setTotal(data.totalPrice)
                setCountInvoice(data.countInvoice)
                const invoices = data.invoice.map(item => {
                    return {
                        ...item,
                        key: item._id
                    }
                })
                dispatch(setInvoices(invoices))

            })
            .catch(err => {
                console.log(err)
            })
    }, [])
    const totalPrice = useMemo(() => {
        const result = invoicesSearch?.reduce((total, current) => {
            return total + (current.guestInfo.totalPrice)
        }, 0)

        return result
    }, [invoicesSearch])


    const columns = [
        {
            title: "ID Đơn Đặt Phòng",
            dataIndex: "_id",
            key: "_id",
            align:"center"
        },
        {
            title: "Khách Hàng",
            key: 'nameCus',
            render: (text, record) => {
                // Kiểm tra nếu cusID có nameCus, nếu có thì lấy giá trị đó
                return record.cusID && record.cusID.cusName ? record.cusID.cusName : record.guestInfo.name;
            }
        },
        {
            title: "Số Điện Thoại",
            dataIndex: ['guestInfo', 'phone'], // Chỉnh sửa dataIndex
            key: 'phonCus',
             align:"center"
        },
        {
            title: "Ngày Đặt",
            dataIndex: "createDay", // Đảm bảo đúng tên thuộc tính
            key: "createAt",
            render: (text) => formatDay(text),
            sorter: (a, b) => new Date(a) - new Date(b),
            align:"center"
        },
        {
            title: "Khách Sạn",
            dataIndex: ['hotelID', 'hotelName'], // Chỉnh sửa dataIndex
            key: 'hotelName',
        },
        {
            title: "Phòng Đặt",
            dataIndex: ['roomID', 'roomName'], // Chỉnh sửa dataIndex
            key: 'roomName',
        },
        {
            title: "Ngày Vào",
            dataIndex: ['guestInfo', 'checkInDay'], // Chỉnh sửa dataIndex
            key: 'checkInDay',
            render: (text) => formatDay(text),
            align:"center"
        },
        {
            title: "Ngày Ra",
            dataIndex: ['guestInfo', 'checkOutDay'], // Chỉnh sửa dataIndex
            key: 'checkOutDay',
            render: (text) => formatDay(text),
            align:"center"
        },
        {
            title: "Tổng Phòng Đặt",
            dataIndex: ['guestInfo', 'totalRoom'], // Chỉnh sửa dataIndex
            key: 'totalRoom',
            align:"center"
        },
        {
            title: "Tổng Tiền",
            dataIndex: ['guestInfo', 'totalPrice'], // Đảm bảo lấy đúng thuộc tính
            key: 'totalPrice',
            render: (text) => formatMoney(text) + " VNĐ",
            align:"center"
        },
        {
            title: "Trạng Thái Đặt Phòng",
            dataIndex: "invoiceState",
            key: "invoiceState",
        },
        {
            title: "Phương thức thanh toán",
            dataIndex:['guestInfo', 'paymentMethod'],
            key: "paymentMethod",
        },
    ];
    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
    }
    const metrics = [
        {
            title: "Tổng khách sạn",
            value: countHotel,
            linkText: "Xem tất cả",
            icon: faHotel,
            link: "/owner/Hotel",
        },
        {
            title: "Tổng phòng",
            value: countRoom,
            linkText: "Xem tất cả",
            icon: faBed,
            link: "/owner/Room",
        },
        {
            title: "Tổng đơn đặt phòng",
            value: countInvoice,
            linkText: "Xem tất cả",
            icon: faReceipt,
            link: "/owner/Revenue",
        },
        {
            title: "Tổng doanh thu",
            value: formatMoney(totalDefauld) + " VNĐ",
            linkText: "Xem tất cả",
            icon: faMoneyBill1Wave,
            link: "/owner/Revenue",
        },
    ]

    const getDataSet = (invoices) => {
        let result = isMobile ? [] : [
            {
                month: 1,
                revenue: 0
            },
            {
                month: 2,
                revenue: 0
            },
            {
                month: 3,
                revenue: 0
            },
            {
                month: 4,
                revenue: 0
            },
            {
                month: 5,
                revenue: 0
            },
            {
                month: 6,
                revenue: 0
            },
            {
                month: 7,
                revenue: 0
            },
            {
                month: 8,
                revenue: 0
            },
            {
                month: 9,
                revenue: 0
            },
            {
                month: 10,
                revenue: 0
            },
            {
                month: 11,
                revenue: 0
            },
            {
                month: 12,
                revenue: 0
            }
        ]

        for (let item of invoices) {
            const data = {
                month: dayjs(item.createDay).month() + 1,
                revenue: item.guestInfo.totalPrice
            }

            if (result.length <= 0) {
                result.push(data)
            } else {
                const index = result.findIndex(item => item.month === data.month)
                if (index < 0) {
                    result.push(data)
                } else {
                    result[index] = {
                        ...result[index],
                        revenue: result[index].revenue + data.revenue
                    }
                }
            }
        }

        result = result
        return result
    }
    const dataset = getDataSet(invoices)
        .sort((a, b) => a.month - b.month)
        .map(item => ({
            ...item,
            month: "Tháng" + item.month
        }));

    const handleChange = (dates, dateStrings) => {
        dispatch(getInvoicesDay(dates))
    }
    const handleReset = () => {
        dispatch(setInvoices(invoices))
    }

    return (
        <>

            <div className=' m-[10px] grid gap-[20px] mb-[20px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'>
                {metrics.map(metric => (
                    <MetricCard key={metric.title} {...metric} />
                ))}
            </div>
            <h2 className='m-[15px] text-[#003580]'>Thống kê doanh thu</h2>
            <div className='flex m-auto'>
                <ChartRevenue dataset={dataset} />
            </div>
            <Row className='m-[15px]'>
                <Col>
                    <div className='text-[20px] font-bold mb-[5px]'> Lịch</div>
                    <DatePicker.RangePicker className='mr-[5px]' onChange={handleChange} format={"DD/MM/YYYY"}></DatePicker.RangePicker>
                    <Button onClick={handleReset}>Mặc định</Button>
                </Col>
            </Row>


            <div className='m-[15px] font-bold text-[20px] text-[#003580] d-flex flex-col justify-center items-center' >
                <div> Tổng doanh thu </div>
                <div>{formatMoney(totalPrice)} VNĐ</div>
            </div>

            <div className={isMobile ? "mr-[20px]" : ""}>
                <Table

                    columns={columns}
                    dataSource={invoicesSearch}
                    scroll={{
                        x: 'max-content',
                    }}
                >

                </Table>
            </div>
        </>
    )
}

export default Revienue