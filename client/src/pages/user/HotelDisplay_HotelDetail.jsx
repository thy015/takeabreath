import React from "react";
import {useLocation, useParams } from "react-router-dom";
import { useGet } from "../../hooks/hooks";
import { Spin, Alert, Row, Col } from "antd";
import { RateStar, RateText } from "../../component/Rate";
import { MdRoom } from "react-icons/md";
import { CiHeart, CiShare2 } from "react-icons/ci";

import HotelDetail_RoomDisplay from "./HotelDetail_RoomDisplay";
import { useSelector } from "react-redux";

const HotelDisplay_HotelDetail = () => {
    const { id } = useParams();
    const location=useLocation()
    const {roomData}=location.state || {roomData:[]}
     // query room data result, integrate countRoom
      const {countRoom}=useSelector((state)=>state.searchResults)
      const specRoomData=roomData.filter(r=>r.hotelID===id)
        const specRoomIntegratedCount=specRoomData.map((room)=> {
          const countEach=countRoom.find((cr)=>cr.roomID===room._id)
          console.log('each',countEach)
          return {
            ...room,
            countRoom:countEach ? countEach.countRoom :0
            
          }
        })
      const { data, error, loading } = useGet(
        `http://localhost:4000/api/hotelList/hotel/${id}`
      );

      if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
      }

      if (error) {
        console.log(data);
        return (
          <Alert
            message="Error"
            description="Failed to load hotel details."
            type="error"
            showIcon
          />
        );
      }

      if (!data) {
        return <Alert message="No hotel data found" type="info" showIcon />;
      }
  return (
    <div>
      <Row gutter={18}>
        {/* hotel info */}
        <div className="flex justify-between items-center w-full ml-2">
          <div className="flex flex-col items-start">
            <RateStar hotel={data}></RateStar>
            <div>
              <h4 className="font-semibold mt-3">
                {data.hotelName} - {data.city}
              </h4>
              <div className="flex flex-row items-start ">
                <MdRoom className="text-[#0F4098]  mb-3 text-[20px]" />
                <div>
                  {data.address}, {data.city}, {data.nation}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center mr-2">
            <div className="flex cursor-pointer mr-3">
              <CiHeart className="text-[#1677ff] text-[25px] mr-3 hover:bg-[#fafafa]" />
              <CiShare2 className="text-[#1677ff] text-[25px] hover:bg-[#fafafa]" />
            </div>
            <button
              type="solid"
              className="bg-[#1677ff] text-white py-2 px-3 rounded-md hover:scale-105"
            >
              Reserve
            </button>
          </div>
        </div>

        <Col span={18}>
          <div>
            {/* Fake 3 img until group img to a link */}
            <div>
              <Row gutter={6}>
                {data.imgLink.length > 0 &&
                  <Col span={10}>
                 { data.imgLink.map((item, index) => (

                    <img
                      src={item}
                      alt={`Image of ${data.hotelName}`}
                      className="w-full h-auto mb-2"
                    />

                    ))}
                  </Col>
                }

                <Col span={14}>
                  <img
                    src={data.imgLink.length >= 3 ? data.imgLink[2] : data.imgLink[0]}
                    alt={`Image of ${data.hotelName}`}
                    className="w-full mb-6 h-full"
                  />
                </Col>
              </Row>
            </div>
          </div>
        </Col>

        <Col span={6}>
          {/* Comment - Click to open side tab */}
          <div className="h-1/2 w-full border">
            <div>
              {/* Rate part */}
              <div className="flex justify-end border-b h-[30%]">
                <div className="mr-2">
                  {" "}
                  <RateText hotel={data}></RateText>
                  {data.numberOfRates} people rated
                </div>
                <div
                  className="badge bg-[#0f4098]"
                  style={{
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "10px",
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                >
                  {data.rate}
                </div>
              </div>

              <div className="h-[70%] border-b ">
                {/* The comment part */}
                <div className="h-full bg-slate-400">comment section</div>
              </div>
            </div>
          </div>
          <div className="h-[47.5%] mt-3 w-full border object-cover">
            {/* need map api */}
            <img
              className="h-full w-full"
              src="https://th.bing.com/th/id/OIP.Xl33AAWnwUNysT_nFRsUEgHaHa?rs=1&pid=ImgDetMain"
            />
          </div>
        </Col>

      </Row>
      {/* Feature display */}
      <div> <h4 className="flex mt-12 font-semibold">Feature</h4> </div>
      <div> <h4 className="flex mt-12 font-semibold">Room Available</h4> </div>
      {/* Room display */}
      <div>
      {console.log('Detail hotel in hoteldisplay_hoteldetail',specRoomData)}
      {specRoomData.length === 0 ? (
          <Alert
            message="PLEASE QUERY FIRST"
            description="Please try query to see rooms"
            type="info"
            showIcon
          />
        ) : (
          <HotelDetail_RoomDisplay
            roomData={specRoomIntegratedCount}
            hotel={data}
          ></HotelDetail_RoomDisplay>
        )}
     </div>

    </div>
  );
};

export default HotelDisplay_HotelDetail;
