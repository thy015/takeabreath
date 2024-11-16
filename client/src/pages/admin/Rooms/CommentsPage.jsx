import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spin, Alert } from "antd";
import { useParams } from "react-router-dom"; 

const CommentsPage = () => {
  const { id: roomID } = useParams(); 
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/hotelList/comment/room/${roomID}`
        );
        setComments(response.data);
      } catch (err) {
        setError("Error fetching comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [roomID]);

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  const columns = [
    // {
    //   title: "Người dùng",
    //   dataIndex: ["cusID", "_id"], 
    //   key: "cusID",
    //   render: (cusID) => cusID ? cusID : "Anonymous", 
    // },
    {
      title: "Rate Point",
      dataIndex: "ratePoint",
      key: "ratePoint",
    },
    {
      title: "Nội dung", 
      dataIndex: "content",
      key: "content",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Ngày bình luận",
      dataIndex: "createdDay",
      key: "createdDay",
      render: (text) => new Date(text).toLocaleString("vi-VN"), 
    },
  ];

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px] h-full">
      <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69]">
        Bình luận cho phòng {comments[0]?.roomID?.roomName || roomID}
      </h1>
      <Table
        columns={columns}
        dataSource={comments}
        rowKey={(record) => record._id}
        pagination={false}
      />
    </div>
  );
};

export default CommentsPage;
