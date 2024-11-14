import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Table, Space, Typography, Popconfirm,Input } from 'antd'
import { useMediaQuery } from 'react-responsive';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormRoom from '../../../component/FormRoom'
import axios from 'axios'
import { openNotification } from '../../../hooks/notification'
import { setHotels } from '../../../hooks/redux/hotelsSclice'
import ViewComment from '../../../component/ViewComment';
import { setRooms, deleteRoom, selectedRoom, searchRoom } from '../../../hooks/redux/roomsSlice'
function Room() {
  const dispatch = useDispatch()
  const rooms = useSelector(state => state.room.roomSearch)
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  const [visibleComment,setVisibleComment] = useState(false)
  const [record,setRecord] = useState(false)

  const BE_PORT=import.meta.env.VITE_BE_PORT
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
  }, [])



  const handleDelete = (record) => {
    axios.delete(`${BE_PORT}/api/hotelList/deleteRoom/${record._id}`)
      .then(res => res.data)
      .then(data => {
        dispatch(deleteRoom(record._id))
        openNotification(true, "Xóa phòng thành công", "")
      })
      .catch(err => {
        console.log(err)
        openNotification(false, "Xóa phòng thất bại !", err.response?.data?.message?? "Vui long thử lại sau")
      })
  }

  const handleUpdate = (record) => {
    dispatch(selectedRoom(record))
    setVisible(true)
  }

  const handleClickRow = (record)=>{
    setRecord(record)
    setVisibleComment(true)
  }

  const onSearch = (value)=>{
    dispatch(searchRoom(value))
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
    ,
    {
      title: "Số lượt đánh giá",
      dataIndex: "comments",
      key: "comments",
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
      fixed: isMobile?"":"right",
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
      <div className='w-full text-left py-[20px] px-[40px] d-flex justify-between items-center'>
        <Link >
          <Button
            className={!isMobile ? "" :"hidden"}
            onClick={() => setVisible(true)}
            type='primary'
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
            Thêm phòng
          </Button>
          <Button
            className={isMobile ? "" :"hidden"}
            onClick={() => setVisible(true)}
            type='primary'
            icon={<FontAwesomeIcon icon={faPlus} />}
          >
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

      <Table
        onRow={(record,rowIndex)=>{
          return{
            onClick:()=>handleClickRow(record)
          }
        }}
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
        close={()=>setVisibleComment(false)}
        record={record}
      >

      </ViewComment>
    </div>
  )
}

export default Room