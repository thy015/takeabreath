import { Button } from 'react-bootstrap'
import { AuthContext } from "../../hooks/auth.context";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import styled from "styled-components";
import { Alert, Select, Spin } from "antd";
import { useGet } from "../../hooks/hooks";
import { FaLocationDot, FaPhone, FaCircleQuestion } from "react-icons/fa6"
import { IoIosBed } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { MdPolicy, MdOutlineCancel } from "react-icons/md";
import dayjs from "dayjs";
import axios from "axios";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ModalComment from '../../component/ModalComment';
import { getComment } from '../../hooks/redux/roomsSlice';
import { setInvoices, sortInvoice } from '../../hooks/redux/revenueSlice';

const BookingPage = () => {
  const dispatch = useDispatch()
  const { auth } = useContext(AuthContext);
  const id = auth?.user?.id;

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const BE_PORT = import.meta.env.VITE_BE_PORT
  console.log(id)
  if (!id) {
    return <Alert message="Please try sign in first" type="info" showIcon />;
  }

  //modal 1st cancel pop-up
  const [clickCancel, setClickCancel] = useState(false)
  const [isClickedConfirmCancel, setClickedConfirmCancel] = useState(false);

  const invoicesTemps = useSelector(state => state.invoiceRevenue.invoiceTemps)
  const invoices = useSelector(state => state.invoiceRevenue.invoices)

  const [visible, setVisible] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState({})
  const comment = useSelector(state => state.room.comments)
  const handleClickCancel = (invoiceID) => {
    setClickCancel((prevState) => ({
      ...prevState,
      [invoiceID]: !prevState[invoiceID]
    }))
  }
  const closeCancelConfirm = (invoiceID) => {
    setClickCancel((prevState) => ({
      ...prevState,
      [invoiceID]: false,
    }));
  };


  const formatMoney = (money) => {
    return new Intl.NumberFormat("de-DE").format(money);
  };

  const disableCancelFunc = (checkInDay) => {
    const now = dayjs().tz('Asia/Ho_Chi_Minh')
    const formattedCheckInDay = dayjs(checkInDay).tz('Asia/Ho_Chi_Minh')
    if (formattedCheckInDay.isSame(now, 'day')) {
      // after 12pm => disable
      const todayNoon = now.startOf('day').add(12)
      return now.isAfter(todayNoon)
    }
    else {
      return formattedCheckInDay.isBefore(now)
    }
  }
  const disableCancelConfirmAfterClicked = (invoiceID) => {
    setClickedConfirmCancel((prevState) => ({
      ...prevState,
      [invoiceID]: true,
    }));
  }
  // handle cancel confirm clicked
  const handleConfirmCancel = async (invoiceID, checkInDay, id) => {
    const now = dayjs().tz('Asia/Ho_Chi_Minh');
    const countDiffDay = dayjs(checkInDay).tz('Asia/Ho_Chi_Minh').diff(now, 'day');

    const passingData = { countDiffDay, id };
    try {
      disableCancelConfirmAfterClicked(invoiceID)
      const res = await

        axios.post(
          `${BE_PORT}/api/booking/bookingHistory/${invoiceID}/cancel`,
          passingData,
          { headers: { Authorization: `Bearer ${auth.token}` } }
        );
      console.log('Response:', res.data);

    } catch (error) {
      console.error('Error canceling booking:', error.message);
    }
  };

  const { data, error, loading } = useGet(`${BE_PORT}/api/booking/bookingHistory/${id}`)


  //handle comment
  const handleComment = async (resData) => {
    setVisible(true)
    setSelectedInvoice(resData)
  }
  //function check exp comment checkOutDay and was commented
  const expComment = (checkOutDay, invoiceID) => {

    // check day
    const now = dayjs()
    const dateDiff = now.diff(dayjs(checkOutDay), "day")
    // check commented 
    const roomCommented = comment.find(item => item.invoiceID == invoiceID)
    if (roomCommented) {
      return true
    }
    if (dateDiff >= 7) {
      return true
    }
    return false
  }

  useEffect(() => {
    dispatch(setInvoices(data.data))
  }, [data])

  useEffect(() => {
    axios.get(`${BE_PORT}/api/hotelList/get-comment-cus`)
      .then(res => {
        dispatch(getComment(res.data.message))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])


  //options sort
  const options = [
    {
      label: "Default",
      value: "default"
    },
    {
      label: "Upcoming",
      value: "future"
    },
    {
      label: "Currently",
      value: "current"
    },
    {
      label: "Expired",
      value: "expired"
    },
  ]
  // handle sort by options
  const handleSortByOptions = (value) => {
    const valueSet = {
      value,
      invoices
    }
    dispatch(sortInvoice(valueSet))

  }
  console.log("[SORT]", invoicesTemps)
  // console.log(localStorage.getItem('invoiceData'))
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return <Alert message="Notice" description="You haven't make any reservation." type="info" showIcon />;
  }


  return (

    <div className="container mx-auto p-4">
      {/*sort*/}
      <div className='history-wrapper'>
        <div className='history-dropdown'>
         <Select options={options} defaultValue={"default"} className='w-full' onChange={handleSortByOptions}></Select>
        </div>
      </div>
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

        {invoicesTemps?.length >0 ? invoicesTemps.map((resData, index) => {
          const formattedCheckInDay = dayjs(resData.invoiceInfo.guestInfo.checkInDay).format('DD/MM/YYYY')
          const formattedCheckOutDay = dayjs(resData.invoiceInfo.guestInfo.checkOutDay).format('DD/MM/YYYY')
          //stop rendering if found a cancel infor of that room
          if (resData.cancelInfo && resData.cancelInfo.length > 0) {
            console.log('hiding', resData)
            return null
          }
          console.log('invoice id', resData.invoiceInfo._id)
          console.log('checkinday', resData.invoiceInfo.guestInfo.checkInDay)
          const isDisabledCancel = disableCancelFunc(resData.invoiceInfo.guestInfo.checkInDay);
          return (
            <div key={index} className='py-2'>
              <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
                <div className='row h-auto border-b'>
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
                          {formatMoney(resData.invoiceInfo.guestInfo.totalPrice)} VND
                        </div>
                      </BetweenFlex>
                    </div>
                  </div>
                </div>
                {/*Cancel Information*/}
                <div className="space-y-4">
                  <DecoratedIcon>
                    <MdPolicy />
                    <span className='ml-2'>Our Policy - Reimburse for room canceled</span>
                  </DecoratedIcon>
                  <DecoratedIcon>
                    <FaCircleQuestion />
                    <span className='ml-2'>FAQs</span>
                  </DecoratedIcon>
                  <div>
                    <div className='space-x-2 flex items-end justify-end relative'>
                      <Button variant={isDisabledCancel ? 'muted' : 'danger'}
                        onClick={() => { handleClickCancel(resData.invoiceInfo._id) }}
                        disabled={isDisabledCancel}
                      >
                        Cancel</Button>
                      <Button variant='success'>Book Again</Button>
                      <Button
                        disabled={expComment(resData.invoiceInfo?.guestInfo.checkOutDay, resData.invoiceInfo?._id)}
                        variant='outline-primary'
                        onClick={() => handleComment(resData)}
                      >Rate The Accommodation</Button>
                    </div>
                    {clickCancel[resData.invoiceInfo._id] && (
                      <div>
                        <CancelConfirm>
                          <div className='bg-red-300 pl-4 text-2xl font-semibold font-afacad relative'>
                            *Please make sure you read our policy below before cancel your room
                            <MdOutlineCancel className='absolute top-0 right-0 z-10 text-2xl mr-1 mt-1'
                              onClick={() => {
                                closeCancelConfirm(resData.invoiceInfo._id)
                              }}>
                            </MdOutlineCancel>
                          </div>
                          <div
                            className='flex items-center justify-center text-2xl font-afacad font-semibold py-4'>
                            Our cancel policy
                          </div>

                          <div className='row h-auto px-4'>
                            <div className='col-6 border-r'>
                              <div>
                                <Title className='text-success'>
                                  70% REIMBURSE
                                </Title>
                                If you <BoldSpan>cancel 24 hours before check-in day</BoldSpan>
                              </div>
                              <div className='text-muted'>
                                Example: Your check-in day start at: 24/11/2024
                                <div>
                                  You'll receive 70% reimburse for your booking fees if you cancel before
                                  23/11/2024
                                </div>
                              </div>
                            </div>
                            <div className='col-6'>
                              <Title className='text-danger-emphasis'>
                                NO REIMBURSE
                              </Title>
                              <div>
                                <BoldSpan> Within 24 hours before check-in day,</BoldSpan> you can't receive any
                                reimburse
                              </div>
                              <div className='text-muted'>
                                Example: Your check-in day start at: 24/11/2024 and you cancel within 23/11-24/11
                                <span> You won't receive any reimbursement  </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className='flex-center font-afacad text-muted text-xl mt-2'>
                            Please make sure you added a valid card before cancel
                            <span className='ml-2 px-2 cursor-pointer border-bottom'>Add here</span>
                          </div>
                          <div className='flex items-end justify-end mr-3 py-3'>
                            <Button variant='outline-danger' onClick={() => {
                              handleConfirmCancel(resData.invoiceInfo._id, resData.invoiceInfo.guestInfo.checkInDay, id)
                            }}
                              disabled={isClickedConfirmCancel[resData.invoiceInfo._id]}
                            >
                              Accept Cancel
                            </Button>
                          </div>
                        </CancelConfirm>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        }) : (
            <Alert type='info' message='No invoices match your inquiry' showIcon></Alert>
        )}

      </section>
      <ModalComment
        open={visible}
        close={() => setVisible(false)}
        selectedInvoice={selectedInvoice}
      />
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
const BetweenFlex = styled.div`
  display: flex;
  justify-content: space-between;
`
const CancelConfirm = styled.div`
  z-index: 10;
  background: white;
  align-items: start;
  justify-content: center;
  margin-top: 20px;
  text-align: left;
  border: black solid 1px ;
`
const Title = styled.div`
  text-align: center;
  font-weight: 600;
  font-size: large;
  padding-bottom: 12px;
`
const BoldSpan = styled.span`
  font-weight: 600;
  color:green;
`