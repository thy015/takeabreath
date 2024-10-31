import {Button} from 'react-bootstrap'
import { AuthContext } from "../../hooks/auth.context";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Alert, Spin } from "antd";
import {useGet} from "../../hooks/hooks";
import { FaLocationDot,FaPhone,FaCircleQuestion } from "react-icons/fa6"
import { IoIosBed } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { MdPolicy } from "react-icons/md";
import dayjs from "dayjs";
const BookingPage = () => {
  const { auth } = useContext(AuthContext);

  const id = auth?.user?.id;
  console.log(id)
  if (!id) {
    return <Alert message="Please try logging in first" type="info" showIcon />;
  }
  const {data,error,loading}=useGet(`http://localhost:4000/api/booking/bookingHistory/${id}`)

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return <Alert message="Error" description="Failed to load properties." type="error" showIcon />;
  }

  if (!data || data.length === 0) {
    return <Alert message="You have not booked any hotel" type="info" showIcon />;
  }

  return (
      <div className="container mx-auto p-4">
        <section className="my-10">
          <div className="relative flex">
            <img
                src="https://img.freepik.com/premium-photo/man-relaxing-hammock-tropical-beach-working-laptop_14117-930839.jpg"
                alt="upcoming event"
                className="rounded-md w-full h-[300px] brightness-75 relative object-cover"
            />
            <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/man-booking-travel-ticket-online-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--flight-book-travelling-pack-holidays-illustrations-6475989.png"
                alt="tourist-man"
                className="absolute right-0 z-10 w-[45%] scale-x-[-1]"
            />
            <div className="absolute">
              <div className="relative text-[#CBDCEB] text-4xl font-afacad p-4 z-10">Booking History</div>
              <div className="absolute text-[#1A4297] text-4xl font-afacad p-4 z-10 inset-0 transform -translate-x-0.5 -translate-y-0.5">Booking History</div>
              <div className="inset-4 bg-white absolute rounded-b"></div>
            </div>
          </div>

          {/* Booking details */}

          {data.data.map((resData,index)=>{
            const formattedCheckInDay=dayjs(resData.invoiceInfo.guestInfo.checkInDay).format('DD/MM/YYYY')
            const formattedCheckOutDay=dayjs(resData.invoiceInfo.guestInfo.checkOutDay).format('DD/MM/YYYY')

                  return(
              <div key={index} className='py-2'>
                <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
                  <div className='row h-[150px] border-b'>
                    {/*Hotel Info*/}
                    <div className='col-4 flex'>
                      <img
                          src={resData.hotelInfo.imgLink[0]}
                          alt='pic'
                          className="w-[100px] h-[100px] object-cover rounded-md"
                      />
                      <div className='pl-4 text-left'>
                      <p className="font-bold">
                        Hotel: {resData.hotelInfo.hotelName} - {resData.hotelInfo.city} | {resData.hotelInfo.nation}
                      </p>
                      <div className='flex justify-start items-center'>
                        <FaLocationDot className='text-red-500 mr-2'></FaLocationDot> {resData.hotelInfo.address}
                      </div>
                        <div className='flex justify-start items-center'>
                          <FaPhone className='mr-2'></FaPhone> {resData.hotelInfo.phoneNum}
                        </div>
                      </div>
                    </div>
                    {/*Room Info*/}
                    <div className='col-4 border-l flex'>
                      <img
                          src={resData.roomInfo.imgLink[0]}
                          alt='pic'
                          className="w-[100px] h-[100px] object-cover rounded-md"
                      />
                      <div className='text-left pl-4 w-full space-y-1'>
                        <div className='font-semibold'>Room Information</div>
                        <BetweenFlex className="justify-between flex">
                          <span>Name:</span>
                          <span className="ml-auto">{resData.roomInfo.roomName}</span>
                        </BetweenFlex>
                        <BetweenFlex>
                          <span>Type:</span>
                          <span className="ml-auto">{resData.roomInfo.typeOfRoom}</span>
                        </BetweenFlex>
                        <BetweenFlex>
                          <span><IoIosBed /></span>
                          <span className="ml-auto">{resData.roomInfo.numberOfBeds}</span>
                        </BetweenFlex>
                        <BetweenFlex>
                          <span><IoPeople></IoPeople></span>
                          <span>{resData.roomInfo.capacity}</span>
                        </BetweenFlex>
                      </div>
                      </div>
                    {/*Invoice Info*/}
                    <div className='col-4 border-l'>
                      <div>
                        <div className='font-semibold'>Booking Information</div>
                        <BetweenFlex>
                          <div>
                            <span>Check in: </span>
                            <span>{formattedCheckInDay}</span>
                          </div>
                          <div>
                            <span>Check out: </span>
                            <span>{formattedCheckOutDay}</span>
                          </div>
                        </BetweenFlex>
                        <BetweenFlex>
                          <div>
                            Guest Name:
                          </div>
                          <div>
                            {resData.invoiceInfo.guestInfo.name}
                          </div>
                        </BetweenFlex>
                        <BetweenFlex>
                          <div>
                            Pay via:
                          </div>
                          <div>
                            {resData.invoiceInfo.guestInfo.paymentMethod}
                          </div>
                        </BetweenFlex>
                        <BetweenFlex>
                          <div>
                            Total Rooms Booked:
                          </div>
                          <div>
                            {resData.invoiceInfo.guestInfo.totalRoom}
                          </div>
                        </BetweenFlex>
                        <BetweenFlex>
                          <div>
                            Price:
                          </div>
                          <div>
                            {resData.invoiceInfo.guestInfo.totalPrice}
                          </div>
                        </BetweenFlex>
                      </div>
                    </div>
                  </div>
                  {/*Cancel Information*/}
                  <div className="space-y-4">
                    <DecoratedIcon>
                      <MdPolicy/>
                      <span className='ml-2'>Our Policy - Reimburse for room canceled</span>
                    </DecoratedIcon>
                    <DecoratedIcon>
                      <FaCircleQuestion/>
                      <span className='ml-2'>FAQs</span>
                    </DecoratedIcon>
                    <div>
                      <div className='space-x-2 flex items-end justify-end'>
                      <Button variant='danger'>Cancel</Button>
                      <Button variant='success'>Book Again</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )})}

        </section>
      </div>
  );
};

export default BookingPage;

const DecoratedIcon = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 1px gray;
  padding-top: 8px;
  margin-bottom: 8px;
`;
const BetweenFlex=styled.div`
  display: flex;
  justify-content: space-between;
`