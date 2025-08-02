import {Button} from 'react-bootstrap'
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux'
import styled from "styled-components";
import {Alert, Select, Spin} from "antd";
import {FaLocationDot, FaPhone, FaCircleQuestion} from "react-icons/fa6"
import {IoIosBed} from "react-icons/io";
import {IoPeople} from "react-icons/io5";
import {MdPolicy, MdOutlineCancel} from "react-icons/md";
import dayjs from "dayjs";
import axios from "axios";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {setInvoices} from "@/store/redux/revenueSlice";
import {getComment} from "@/store/redux/roomsSlice";
import ModalComment from "@/components/ModalComment";
import {MoveRight} from "lucide-react";
import {formatMoney} from "@/utils/utils";
import {useBookingHistory} from "@/hooks/useQuery";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import {useToastNotifications} from "@/hooks/useToastNotification";
const BookingPage = () => {
  dayjs.extend (utc);
  dayjs.extend (timezone);
  dayjs.extend(isSameOrBefore);

  const dispatch = useDispatch ()
  const BE_PORT = import.meta.env.VITE_BE_PORT
  const auth = useSelector (state => state.auth)
  const toast=useToastNotifications()
  const userId = auth?.id
  console.log('userId',userId);
  // Query the booking history base on user id
  const {data, error, isLoading, refetch} = useBookingHistory (userId);
  if (!auth?.id) {
    return <Alert message="Please try sign in first" type="info" showIcon/>;
  }

  useEffect (() => {
    axios.get (`${BE_PORT}/api/hotelList/get-comment-cus`).then (res => {
      dispatch (getComment (res.data.message))
    }).catch (err => {
      console.log (err)
    })
  }, [])

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId, refetch]);

  useEffect(() => {
    if (data?.bookingInfo) {
      dispatch(setInvoices(data.bookingInfo));
    }
  }, [data, dispatch]);
  //modal 1st cancel pop-up
  const [clickCancel, setClickCancel] = useState (false)
  const [isClickedConfirmCancel, setClickedConfirmCancel] = useState (false);

  const [visible, setVisible] = useState (false)
  const [selectedInvoice, setSelectedInvoice] = useState ({})
  const comment = useSelector (state => state.room.comments)
  const handleClickCancel = (invoiceID) => {
    setClickCancel ((prevState) => ({
      ...prevState,
      [invoiceID]: !prevState[invoiceID]
    }))
  }
  const closeCancelConfirm = (invoiceID) => {
    setClickCancel ((prevState) => ({
      ...prevState,
      [invoiceID]: false,
    }));
  };

  const disableCancelFunc = (checkInDay) => {
    const now = dayjs ().tz ('Asia/Ho_Chi_Minh')
    const formattedCheckInDay = dayjs (checkInDay).tz ('Asia/Ho_Chi_Minh')
    if (formattedCheckInDay.isSame (now, 'day')) {
      // after 12pm => disable
      const todayNoon = now.startOf ('day').add (12)
      return now.isAfter (todayNoon)
    } else {
      return formattedCheckInDay.isBefore (now)
    }
  }
  const disableCancelConfirmAfterClicked = (invoiceID) => {
    setClickedConfirmCancel ((prevState) => ({
      ...prevState,
      [invoiceID]: true,
    }));
  }
  // handle cancel confirm clicked
  const handleConfirmCancel = async (invoiceID, checkInDay, id) => {
    const now = dayjs ().tz ('Asia/Ho_Chi_Minh');
    const countDiffDay = dayjs (checkInDay).tz ('Asia/Ho_Chi_Minh').diff (now, 'day');

    const passingData = {countDiffDay, id};
    try {
      disableCancelConfirmAfterClicked (invoiceID)
      const res = await axios.post (
          `${BE_PORT}/api/booking/bookingHistory/${invoiceID}/cancel`,
          passingData,
          {headers: {Authorization: `Bearer ${auth.token}`}}
        );
      if (res.status === 200) {
        toast.showSuccess(res.data.message)
        console.log ('Response:', res.data);
      }
    } catch (error) {
      console.error ('Error canceling booking:', error.message);
      toast.showError('Error in canceling booking')
      throw error;
    }
  };

  console.log ('Invoice data', data)
  //handle comment
  const handleComment = async (resData) => {
    setVisible (true)
    setSelectedInvoice (resData)
  }
  //function check exp comment checkOutDay and was commented
  const expComment = (checkOutDay, invoiceID) => {
    const now = dayjs ();
    const dateDiff = now.diff (dayjs (checkOutDay), "day");

    // Check if the user has already commented
    const roomCommented = comment.find (item => item.invoiceID === invoiceID);
    // Check if more than 7 days and at least 3 days have passed since the check-out day
    if (dateDiff >= 7 || dateDiff < 3 || roomCommented) {
      return true;
    }
    return false;
  };

  //options sort
  const options = [
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

  const handleSortByOptions = (value) => {
    const now = dayjs ().tz ('Asia/Ho_Chi_Minh');

    const sortedData = data.bookingInfo.filter ((resData) => {
      const checkInDay = dayjs (resData.invoiceInfo.guestInfo.checkInDay).tz ('Asia/Ho_Chi_Minh');
      const checkOutDay = dayjs (resData.invoiceInfo.guestInfo.checkOutDay).tz ('Asia/Ho_Chi_Minh');

      if (value === 'future') {
        return checkInDay.isAfter (now);
      } else if (value === 'current') {
        return checkInDay.isSameOrBefore (now) && checkOutDay.isAfter (now);
      } else if (value === 'expired') {
        return checkOutDay.isBefore (now);
      }
      return false;
    });

    dispatch (setInvoices (sortedData));
  };

  if (isLoading) {
    return <Spin size="large" style={{display: "block", margin: "auto"}}/>;
  }
  if (error) {
    return <Alert message="Notice" description="You haven't make any reservation." type="info" showIcon/>;
  }
  return (
    <div className="w-full mx-auto p-4">
      {/*sort*/}
      <div className='history-wrapper'>
        <div className='history-dropdown'>
          <Select options={options} defaultValue={"future"} className='w-full' onChange={handleSortByOptions}></Select>
        </div>
      </div>
      <section className="my-10">
        <div className="relative flex">
          <img
            src="https://img.freepik.com/premium-photo/man-relaxing-hammock-tropical-beach-working-laptop_14117-930839.jpg"
            alt="upcoming event"
            className="rounded-md w-full h-[300px] brightness-75 relative object-cover"
          />
          <div className="absolute">
            <div className="relative text-[#CBDCEB] text-4xl font-afacad p-4 z-10">Booking History</div>
            <div
              className="absolute text-[#1A4297] text-4xl font-afacad p-4 z-10 inset-0 transform -translate-x-0.5 -translate-y-0.5">Booking
              History
            </div>
            <div className="inset-4 bg-white absolute rounded-b"></div>
          </div>
        </div>

        {/* Booking details */}
        {data?.bookingInfo?.length  > 0 ? (data.bookingInfo.map ((item, index) => {
          const formattedCheckInDay = dayjs (item.invoiceInfo.guestInfo.checkInDay).format ('DD/MM/YYYY')
          const formattedCheckOutDay = dayjs (item.invoiceInfo.guestInfo.checkOutDay).format ('DD/MM/YYYY')
          console.log ('invoice id', item.invoiceInfo._id)
          console.log ('checkinday', item.invoiceInfo.guestInfo.checkInDay)
          const isDisabledCancel = disableCancelFunc (item.invoiceInfo.guestInfo.checkInDay);
          return (
            <div key={index} className='py-2'>
              <div className="relative bg-[#f5f5f5] rounded-lg shadow-md p-4 mt-2">
                <div className='row h-auto border-b'>
                  {/*Hotel Info*/}
                  <div className='col-4 flex'>
                    <img
                      src={item.hotelInfo.imgLink[0]}
                      alt='pic'
                      className="w-[100px] h-[100px] object-cover rounded-md"
                    />
                    <div className='pl-4 text-left'>
                      <p className="font-bold">
                        Hotel {item.hotelInfo.hotelName} - {item.hotelInfo.city} | {item.hotelInfo.nation}
                      </p>
                      <div className='flex justify-start items-center'>
                        <FaLocationDot className='text-red-500 mr-2'></FaLocationDot> {item.hotelInfo.address}
                      </div>
                      <div className='flex justify-start items-center'>
                        <FaPhone className='mr-2'></FaPhone> {item.hotelInfo.phoneNum}
                      </div>
                    </div>
                  </div>
                  {/*Room Info*/}
                  <div className='col-4 border-l flex'>
                    <img
                      src={item.roomInfo.imgLink[0]}
                      alt='pic'
                      className="w-[100px] h-[100px] object-cover rounded-md"
                    />
                    <div className='text-left pl-4 w-full space-y-1'>
                      <div className='font-semibold'>Room Information</div>
                      <BetweenFlex className="justify-between flex">
                        <span>Room:</span>
                        <span className="text-right">{item.roomInfo.roomName}</span>
                      </BetweenFlex>
                      <BetweenFlex>
                        <span>Type:</span>
                        <span className="ml-auto">{item.roomInfo.typeOfRoom}</span>
                      </BetweenFlex>
                      <BetweenFlex>
                        <span><IoIosBed/></span>
                        <span className="ml-auto">{item.roomInfo.numberOfBeds}</span>
                      </BetweenFlex>
                      <BetweenFlex>
                        <span><IoPeople></IoPeople></span>
                        <span>{item.roomInfo.capacity}</span>
                      </BetweenFlex>
                    </div>
                  </div>
                  {/*Invoice Info*/}
                  <div className='col-4 border-l'>
                    <div>
                      <div className='font-semibold'>Booking Information</div>
                      <BetweenFlex>
                        <span>{formattedCheckInDay}</span>
                        <MoveRight size={24}/>
                        <span>{formattedCheckOutDay}</span>

                      </BetweenFlex>
                      <BetweenFlex>
                        <div>
                          Guest Name:
                        </div>
                        <div>
                          {item.invoiceInfo.guestInfo.name}
                        </div>
                      </BetweenFlex>
                      <BetweenFlex>
                        <div>
                          Pay via:
                        </div>
                        <div>
                          {item.invoiceInfo.guestInfo.paymentMethod}
                        </div>
                      </BetweenFlex>
                      <BetweenFlex>
                        <div>
                          Total Rooms Booked:
                        </div>
                        <div>
                          {item.invoiceInfo.guestInfo.totalRoom}
                        </div>
                      </BetweenFlex>
                      <BetweenFlex>
                        <div>
                          Price:
                        </div>
                        <div>
                          {formatMoney (item.invoiceInfo.guestInfo.totalPrice)} VND
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
                    <div className='space-x-2 flex items-end justify-end relative'>
                      <Button variant={isDisabledCancel ? 'muted' : 'danger'}
                              onClick={() => {
                                handleClickCancel (item.invoiceInfo._id)
                              }}
                              disabled={isDisabledCancel}
                      >
                        Cancel</Button>
                      <Button variant='success'>Book Again</Button>
                      <Button
                        disabled={expComment (item.invoiceInfo?.guestInfo.checkOutDay, item.invoiceInfo?._id)}
                        variant={expComment (item.invoiceInfo?.guestInfo.checkOutDay, item.invoiceInfo?._id) ? 'dark' : 'outline-primary'}
                        onClick={() => handleComment (item)}
                      >Rate The Accommodation</Button>
                    </div>
                    {clickCancel[item.invoiceInfo._id] && (
                      <div>
                        <CancelConfirm>
                          <div className='bg-red-300 pl-4 text-2xl font-semibold font-afacad relative'>
                            *Please make sure you read our policy below before cancel your room
                            <MdOutlineCancel className='absolute top-0 right-0 z-10 text-2xl mr-1 mt-1'
                                             onClick={() => {
                                               closeCancelConfirm (item.invoiceInfo._id)
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
                                  You will receive 70% reimburse for your booking fees if you cancel before
                                  23/11/2024
                                </div>
                              </div>
                            </div>
                            <div className='col-6'>
                              <Title className='text-danger-emphasis'>
                                NO REIMBURSE
                              </Title>
                              <div>
                                <BoldSpan> Within 24 hours before check-in day,</BoldSpan> you can not receive any
                                reimburse
                              </div>
                              <div className='text-muted'>
                                Example: Your check-in day start at: 24/11/2024 and you cancel within 23/11-24/11
                                <span> You will not receive any reimbursement  </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className='flex-center font-afacad text-muted text-xl mt-2'>
                            Please make sure you added a valid card before cancel
                            <span className='ml-2 px-2 cursor-pointer border-bottom'>Add here</span>
                          </div>
                          <div className='flex items-end justify-end mr-3 py-3'>
                            {/*TODO: Add disable cancel button if there's cancel info from server*/}
                            <Button variant='outline-danger'
                                    onClick={() => handleConfirmCancel (item.invoiceInfo._id, item.invoiceInfo.guestInfo.checkInDay, auth.id)}
                                    disabled={isClickedConfirmCancel[item.invoiceInfo._id]}
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
        })) : (
          <Alert type='info' message='No invoices match your inquiry' showIcon></Alert>
        )}

      </section>
      <ModalComment
        open={visible}
        close={() => setVisible (false)}
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
    border: black solid 1px;
`
const Title = styled.div`
    text-align: center;
    font-weight: 600;
    font-size: large;
    padding-bottom: 12px;
`
const BoldSpan = styled.span`
    font-weight: 600;
    color: green;
`