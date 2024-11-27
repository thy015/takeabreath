import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Space, Typography, Popconfirm, Input, DatePicker, Select } from 'antd'
import { useMediaQuery } from 'react-responsive';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormRoom from '../../../component/FormRoom'
import axios from 'axios'
import { openNotification } from '../../../hooks/notification'
import { setHotels } from '../../../hooks/redux/hotelsSclice'
import ViewComment from '../../../component/ViewComment';
import { setRooms, deleteRoom, selectedRoom, searchRoom, setRoomSearch,filterRoomsByHotel } from '../../../hooks/redux/roomsSlice'
function Room() {
  const dispatch = useDispatch()
  const rooms = useSelector(state => state.room.roomSearch)
  const oldRoom = useSelector(state=>state.room.rooms)
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const [visibleComment, setVisibleComment] = useState(false)
  const [record, setRecord] = useState(false)
  const [hotel, setHotels] = useState([])
  
  const BE_PORT = import.meta.env.VITE_BE_PORT
  useEffect(() => {

    axios.get(`${BE_PORT}/api/hotelList/list-room`)
      .then(res => res.data)
      .then(data => {
        const setRoom = data.rooms.map(item => {
          return {
            ...item,
            key: item._id,
            nameHotel: item.hotelID.hotelName
          }
        })
       
        dispatch(setRooms(setRoom))
      })
      .catch(err => {
        console.log(err)
        openNotification(false, "Lấy dữ liệu thất bại", err.messagse)
      })

    axios.get(`${BE_PORT}/api/hotelList/hotelOwner`)
      .then(res=>res.data)
      .then(data=>{
        let hotelsOptions = data.data.map(item=>{
          return {
            label:item.hotelName,
            value:item._id
          }
        })
        hotelsOptions = [
          ...hotelsOptions,
          {
            value:"defauld",
            label:"Mặc định"
          }
        ]
        setHotels(hotelsOptions)
      })
      .catch(err=>{
        console.log(err)
      })
  }, [])

  const formatMoney = (money) => {
    return new Intl.NumberFormat('de-DE').format(money)
}

  const handleDelete = (record) => {
    axios.delete(`${BE_PORT}/api/hotelList/deleteRoom/${record._id}`)
      .then(res => res.data)
      .then(data => {
        dispatch(deleteRoom(record._id))
        openNotification(true, "Vô hiệu hóa phòng thành công", "")
      })
      .catch(err => {
        console.log(err)
        openNotification(false, "Vô hiệu hóa phòng thất bại !", err.response?.data?.message ?? "Vui long thử lại sau")
      })
  }

  const handleUpdate = (record) => {
    dispatch(selectedRoom(record))
    setVisible(true)
  }

  const handleClickRow = (record) => {
    setRecord(record)
    setVisibleComment(true)
  }

  const onSearch = (value) => {
    dispatch(searchRoom(value))
  }

  const onChangeDate = (dates, dateStrings) => {
    if (!dates) {
      dispatch(setRooms(oldRoom))
    } else {
      axios.put(`${BE_PORT}/api/hotelList/filter-room`, { arrayDate: dates })
        .then(res => res.data)
        .then(data => {
          console.log(data)
          const setRoom = data.room.map(item => {
            return {
              ...item,
              _id:item._doc._id,
              key: item._doc._id,
              nameHotel: item._doc.hotelID.hotelName,
              roomName: item._doc.roomName,
              typeOfRoom:item._doc.typeOfRoom,
              numberOfRooms:item._doc.numberOfRooms,
              numberOfBeds:item._doc.numberOfBeds,
              money:item._doc.money,
              hotelID:{_id:item._doc.hotelID._id},
              capacity:item._doc.capacity,
              imgLink:item._doc.imgLink
            }
          })
          dispatch(setRoomSearch(setRoom))
        })
        .catch(err => {
          console.log(err)
          openNotification(false, "Lọc thất bại", err.response?.data?.message)
        })
    }


  }

  const onChangeFilterRoomsByHotel = (value)=>{
    console.log(value)
    const setValue = {
      idHotel : value,
      rooms: oldRoom
    }
    dispatch(filterRoomsByHotel(setValue))
    
  }

  const column = [
    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "roomName"
    },
    {
      title: "Loại phòng",
      dataIndex: "typeOfRoom",
      key: "typeOfRoom"
    },
    {
      title: "Số lượng phòng",
      dataIndex: "numberOfRooms",
      key: "numberOfRooms",
      align: 'center',
      sorter: (a, b) => a.numberOfRooms - b.numberOfRooms
    },
    {
      title: "Số lượng giường",
      dataIndex: "numberOfBeds",
      key: "numberOfBeds",
      align: 'center',
      sorter: (a, b) => a.numberOfBeds - b.numberOfBeds
    },
    {
      title: "Giá tiền",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => a.money - b.money,
      render: (text) => <p>{formatMoney(text)} VNĐ</p>,
      align: 'center'
    },
    {
      title: "Tổng số lượng đặt phòng",
      dataIndex: "revenue",
      key: "revenue",
      align: 'center',
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: "Số phòng còn lại",
      dataIndex: "roomAvailable",
      key: "roomAvailable",
      align: 'center',
      sorter: (a, b) => a.comments - b.comments
    },
    {
      title: "Số lượt đánh giá",
      dataIndex: "comments",
      key: "comments",
      align: 'center',
      sorter: (a, b) => a.comments - b.comments
    },
    {
      title: "Thuộc khách sạn",
      dataIndex: "nameHotel",
      key: "nameHotel",
    },
    {
      title: "Chỉnh sửa",
      key: "edit",
      fixed: isMobile ? "" : "right",
      width: 300,
      render: (_, record) => {
        return (
          <>
            <Space>
              <Typography.Link onClick={(event) => {
                event.stopPropagation()
                handleUpdate(record)
              }
              }>
                <p>Cập nhật</p>
              </Typography.Link>
              <Typography.Link onClick={(event) => {
                event.stopPropagation()
              }} >
                <Popconfirm
                  title="Bạn có muốn vô hiệu hóa không"
                  okText="Có"
                  cancelText="Không"
                  onConfirm={() => handleDelete(record)}>
                  <p>Vô hiệu hóa</p>
                </Popconfirm>
              </Typography.Link>

            </Space>
            <Typography.Link onClick={(event) => {
              event.stopPropagation()
              handleClickRow(record)
            }
            }>
              <p>Xem đánh giá</p>
            </Typography.Link>
          </>
        )
      }
    },
  ]
  const [visible, setVisible] = useState(false)
  return (

    <div className='h-full '>
      <div className='w-full text-left py-[20px] px-[40px] d-flex justify-between items-center'>
        <Link >
          <Button
            className={!isMobile ? "" : "hidden"}
            onClick={() => setVisible(true)}
            type='primary'
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm phòng
          </Button>
          <Button
            className={isMobile ? "" : "hidden"}
            onClick={() => setVisible(true)}
            type='primary'
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
          </Button>
        </Link>
        <div className='flex flex-col justify-center items-center'>
          <p> Xem các phòng được đặt theo ngày</p>
          <DatePicker.RangePicker
            onChange={onChangeDate}
          ></DatePicker.RangePicker>
        </div>
        <div className='flex flex-col justify-center items-center '>
          <p> Lọc phòng theo khách sạn</p>
          <Select
            options={hotel}
            defaultValue={"defauld"}
            className='w-[200px]'
            onChange={onChangeFilterRoomsByHotel}
          >

          </Select>
        </div>
        <Input.Search
          placeholder='Tim kiếm theo tên'
          className='max-w-[200px]'
          allowClear
          enterButton
          onSearch={onSearch}
        />
      </div>

      <Table
        className='mr-[20px]'
        dataSource={rooms}
        columns={column}
        scroll={{
          x: 'max-content',
        }}
        bordered
      ></Table>

      <FormRoom
        isVisible={visible}
        close={() => {
          dispatch(selectedRoom({}))
          setVisible(false)
        }}
      >
      </FormRoom>

      <ViewComment
        visible={visibleComment}
        close={() => setVisibleComment(false)}
        record={record}
      >

      </ViewComment>
    </div>
  )
}

export default Room