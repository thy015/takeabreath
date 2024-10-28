import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Space, Typography, Popconfirm } from 'antd'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormRoom from '../../../component/FormRoom'
import axios from 'axios'
import { openNotification } from '../../../hooks/notification'
import { setHotels } from '../../../hooks/redux/hotelsSclice'
import { setRooms,deleteRoom,selectedRoom } from '../../../hooks/redux/roomsSlice'
function Room() {
  const dispatch = useDispatch()
  const rooms = useSelector(state => state.room.rooms)

  useEffect(() => {
    axios.get("http://localhost:4000/api/hotelList/list-room")
      .then(res => res.data)
      .then(data => {
        const setRoom = data.rooms.map(item => {
          return {
            ...item,
            key: item._id,
            nameHotel:item.hotelID.hotelName
          }
        })
        dispatch(setRooms(setRoom))
      })
      .catch(err => {
        console.log(err)
        openNotification(false, "Lấy dữ liệu thất bại", err.messagse)
      })
  }, [])

  
  
  const handleDelete = (record)=>{
    axios.delete(`http://localhost:4000/api/hotelList/deleteRoom/${record._id}`)
      .then(res=>res.data)
      .then(data=>{
        dispatch(deleteRoom(record._id))
        openNotification(true,"Xóa phòng thành công","")
      })
      .catch(err=>{
        console.log(err)
        openNotification(false,"Xóa phòng thất bại !","Vui long thử lại sau")
      })
  }

  const handleUpdate =(record)=>{
    dispatch(selectedRoom(record))
    setVisible(true)
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
      sorter: (a, b) => a.numberOfRooms - b.numberOfRooms
    },
    {
      title: "Số lượng giường",
      dataIndex: "numberOfBeds",
      key: "numberOfBeds",
      sorter: (a, b) => a.numberOfBeds - b.numberOfBeds
    },
    {
      title: "Giá tiền",
      dataIndex: "money",
      key: "money",
      sorter: (a, b) => a.money - b.money
    },
    {
      title: "Số lượng đặt phòng",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue
    },
    {
      title: "Thuộc khách sạn",
      dataIndex: "nameHotel",
      key: "nameHotel",
    },
    {
      title: "Chỉnh sửa",
      key: "edit",
      fixed: "right",
      width: 200,
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

  ]
  const [visible, setVisible] = useState(false)
  return (

    <div className='h-full '>
      <div className='max-w-[170px] text-left p-[20px]'>
        <Link >
          <Button
            onClick={() => setVisible(true)}
            type='primary'
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm phòng
          </Button>
        </Link>
      </div>

      <Table
        dataSource={rooms}
        columns={column}
        scroll={{
          x: 'max-content',
        }}
        bordered
      ></Table>

      <FormRoom

        isVisible={visible}
        close={() =>{
          dispatch(selectedRoom({}))
          setVisible(false)
          }}
      >
      </FormRoom>
    </div>
  )
}

export default Room