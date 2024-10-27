import { FaCar, FaCog, FaParking } from "react-icons/fa";
import { AuthContext } from "../../hooks/auth.context";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Alert, Spin } from "antd";
import {useGet} from "../../hooks/hooks";

const BookingPage = () => {
  const { auth } = useContext(AuthContext);

  const id = auth?.user?.id;
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
                src="https://img.freepik.com/premium-photo/rendering-forest-hotel-jungle_492154-11392.jpg"
                alt="upcoming event"
                className="rounded-md w-full h-[300px] object-cover brightness-75 relative"
            />
            <img
                src="https://cdn3d.iconscout.com/3d/premium/thumb/man-booking-travel-ticket-online-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--flight-book-travelling-pack-holidays-illustrations-6475989.png"
                alt="tourist-man"
                className="absolute right-0 z-10 w-[35%] scale-x-[-1]"
            />
            <div className="absolute">
              <div className="relative text-[#CBDCEB] text-4xl font-afacad p-4 z-10">Booking History</div>
              <div className="absolute text-[#1A4297] text-4xl font-afacad p-4 z-10 inset-0 transform -translate-x-0.5 -translate-y-0.5">Booking History</div>
              <div className="inset-4 bg-white absolute rounded-b"></div>
            </div>
          </div>

          {/* Booking details */}

          {data.data.map((resData,index)=>(
            <div key={index}>
              <p>{resData.invoiceInfo.invoiceState}</p>
            </div>
          ))}
          <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                          <img
                              src=''
                              alt='pic'
                              className="w-[100px] h-[100px] object-cover rounded-md"
                          />
                          <div className="ml-2">
                            <p className="text-left font-bold">
                              hotelname - hoteladdress
                            </p>
                            <p className="text-left">
                              checkinday - checkoutday
                            </p>
                            <p className="text-green-600 font-semi text-left">Confirmed</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <DecoratedButton>
                          <FaCar />
                          <span className="ml-2">Save up to 10% on transportation options</span>
                        </DecoratedButton>
                        <DecoratedButton>
                          <FaCog />
                          <span className="ml-2">Manage your booking</span>
                        </DecoratedButton>
                        <DecoratedButton>
                          <FaParking />
                          <span className="ml-2">Parking information</span>
                        </DecoratedButton>
                      </div>
                    </div>
          {/*      );*/}
          {/*    })*/}
          {/*))}*/}
        </section>
      </div>
  );
};

export default BookingPage;

const DecoratedButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 1px gray;
  padding-top: 8px;
  margin-bottom: 8px;
`;
