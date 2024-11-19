import React from "react";
import {useLocation, useParams } from "react-router-dom";
import { Row, Col } from "antd";
import { RateStar, RateText } from "../../component/Rate";
import { MdRoom } from "react-icons/md";
import { CiHeart, CiShare2 } from "react-icons/ci";
import HotelDetail_RoomDisplay from "./HotelDetail_RoomDisplay";
import {useSelector} from "react-redux";
import {AmenitiesCard} from "../../component/AccommodationCard";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const HotelDisplay_HotelDetail = () => {
  const { id } = useParams();
  const location=useLocation()
  const {countRoom,clickedHotel,attachedRooms}=useSelector((state)=>state.searchResults)
const{t}=useTranslation();
  // query room data result, integrate countRoom
  const {roomData}=location.state || {roomData:[]}
  const specRoomData=roomData.filter(r=>r.hotelID===id)
  const specRoomIntegratedCount=specRoomData.map((room)=> {
    const countEach=countRoom.find((cr)=>cr.roomID===room._id)
    console.log('each',countEach)
    return {
      ...room,
      countRoom:countEach ? countEach.countRoom :0
    }
  })

  return (
      <div>
        <Row gutter={18}>
          {/* hotel info */}
          <div className="flex justify-between items-center w-full ml-2">
            <div className="flex flex-col items-start">
              <RateStar hotel={clickedHotel}></RateStar>
              <div>
                <h4 className="font-semibold mt-3">
                  {clickedHotel.hotelName} - {clickedHotel.city}
                </h4>
                <div className="flex flex-row items-start ">
                  <MdRoom className="text-[#0F4098]  mb-3 text-[20px]" />
                  <div>
                    {clickedHotel.address}, {clickedHotel.city}, {clickedHotel.nation}
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
{t('reverse')}
              </button>
            </div>
          </div>

          <Col span={18}>
            <div>
              {/*hotel img*/}
              <div>
                <Row gutter={6}>
                  <Col span={10}>
                    <img
                        src={clickedHotel.imgLink[0]}
                        alt={`Image of ${clickedHotel.hotelName}`}
                        className="w-full h-[50%] mb-2"
                    />
                    <img
                        src={clickedHotel.imgLink[1]}
                        alt={`Image of ${clickedHotel.hotelName}`}
                        className="w-full h-[48.3%] "
                    />
                  </Col>
                  <Col span={14}>
                    <img
                        src={clickedHotel.imgLink[2]}
                        alt={`Image of ${clickedHotel.hotelName}`}
                        className="w-full h-full"
                    />
                  </Col>
                </Row>
              </div>
            </div>
          </Col>

          <Col span={6}>
            {/* Comment - Click to open side tab */}
            <div className="h-1/2 w-full border ">
              <div>
                {/* Rate part */}
                <div className="flex justify-end border-b h-[30%]">
                  <div className="mr-2">
                    {" "}
                    <RateText hotel={clickedHotel}></RateText>
                    {clickedHotel.numberOfRates} {t('rated')}
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
                    {clickedHotel.rate}
                  </div>
                </div>

                <div className="h-1/2 border-b ">
                  {/* The comment part */}
                  <div className="h-full bg-slate-400">{t('section')}</div>
                </div>
              </div>
            </div>

            <div className="h-1/2 w-full border object-cover">
              {/* need map api */}
              <img
                  className="h-full w-full"
                  src="https://th.bing.com/th/id/OIP.Xl33AAWnwUNysT_nFRsUEgHaHa?rs=1&pid=ImgDetMain"
              />
            </div>
          </Col>

        </Row>
        {/* Amen display */}
        <div> <Title>{t('offer')}</Title>
          <div className='flex flex-wrap'>
          <AmenitiesCard hotel={clickedHotel}></AmenitiesCard>
        </div>
        </div>
        {/* Comment */}
        <div> <Title >{t('comment')}</Title> </div>
        <div> <Title>{t('available')}</Title> </div>
        {/* Room display */}
        <div>
          {/*bấm ở home*/}
          {specRoomData.length === 0 ? (
              <HotelDetail_RoomDisplay
                  roomData={attachedRooms}
                  hotel={clickedHotel}
              >
              </HotelDetail_RoomDisplay>
          ) : (
              // bấm khi query
              <HotelDetail_RoomDisplay
                  roomData={specRoomIntegratedCount}
                  hotel={clickedHotel}
              ></HotelDetail_RoomDisplay>
          )}
        </div>
      </div>
  );
};

const Title=styled.h3`
  display: flex;
  margin: 32px 0;
  font-weight: 600;
  font-family: "Afacad Flux", sans-serif;
`
export default HotelDisplay_HotelDetail;