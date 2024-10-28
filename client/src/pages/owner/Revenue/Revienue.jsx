import React, { useEffect, useMemo } from 'react'
import { Col, Row, DatePicker, Button, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { setInvoices, getInvoicesDay } from "../../../hooks/redux/revenueSlice"
import dayjs from 'dayjs'
import axios from 'axios'
function Revienue() {
    const dispatch = useDispatch()
    const invoices = useSelector(state => state.invoice.invoices)
    const invoicesSearch = useSelector(state => state.invoice.invoicesSearch)
    const formatDay = (day) => {
        return dayjs(day).format("DD/MM/YYYY")
    }

    const totalPrice = useMemo(() => {
        const result = invoicesSearch.reduce((total, current) => {
            return total + (current.guestInfo.totalPrice)
        }, 0)

        return result
    }, [invoicesSearch])



    useEffect(() => {
        axios.get("http://localhost:4000/api/hotelList/list-invoice-owner")
            .then(res => res.data)
            .then(data => {
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

    const columns = [
        {
            title: "ID Đơn Đặt Phòng",
            dataIndex: "_id",
            key: "_id",
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
        },
        {
            title: "Ngày Đặt",
            dataIndex: "createDay", // Đảm bảo đúng tên thuộc tính
            key: "createAt",
            render: (text) => formatDay(text)
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
            render: (text) => formatDay(text)
        },
        {
            title: "Ngày Ra",
            dataIndex: ['guestInfo', 'checkOutDay'], // Chỉnh sửa dataIndex
            key: 'checkOutDay',
            render: (text) => formatDay(text)
        },
        {
            title: "Tổng Phòng Đặt",
            dataIndex: ['guestInfo', 'totalRoom'], // Chỉnh sửa dataIndex
            key: 'totalRoom',
        },
        {
            title: "Tổng Tiền",
            dataIndex: ['guestInfo', 'totalPrice'], // Đảm bảo lấy đúng thuộc tính
            key: 'totalPrice',
            render: (text) => formatMoney(text) + " VNĐ"
        },
        {
            title: "Trạng Thái Đặt Phòng",
            dataIndex: "invoiceState",
            key: "invoiceState",
        },
    ];


    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
    }

    const handleChange = (dates, dateStrings) => {
        dispatch(getInvoicesDay(dates))
    }
    const handleReset = () => {
        dispatch(setInvoices(invoices))
    }
    
    return (
        <>
            <h2 className='m-[15px] text-[#003580]'>Thống kê doanh thu</h2>
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

            <div>
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