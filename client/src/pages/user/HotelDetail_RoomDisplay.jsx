import React, { useContext, useState,useEffect } from "react";
import { Card } from "react-bootstrap";
import { Row, Col, Button } from "antd";
import BookingConfirmationForm from "../../component/BookingConfirmationForm"
import { useSelector,useDispatch } from "react-redux";
import { AuthContext } from "../../hooks/auth.context";
import { openNotification } from "../../hooks/notification";
import {setPaymentState} from '../../hooks/redux/inputDaySlice'
import { useTranslation } from "react-i18next";
const HotelDetail_RoomDisplay = ({ roomData, hotel }) => {
    // State for room count, where room ID is the key
    const { totalCheckInDay } = useSelector((state) => state.inputDay)
    const dispatch=useDispatch()
    const [counts, setCounts] = useState({});
const {t}=useTranslation();
    //open modal : Phuc
    const [isShow, setShow] = useState(false)

    //send totalPrice paypal
    const handleReserve=(selectedRoom,countRoom,totalPrice)=>{
        setShow(true)
        dispatch(
            setPaymentState({
                selectedHotel:hotel,
                selectedRoom:selectedRoom,
                countRoom:countRoom,
                totalPrice:totalPrice,
                completedPayment:false
            }))
    }
    //get auth context
    const { auth } = useContext(AuthContext)

    const increment = (roomID) => {
        setCounts((prevCounts) => ({
            ...prevCounts,
            [roomID]: (prevCounts[roomID] || 1) + 1, //if undefined => ini=0
        }));
    };


    const decrement = (roomID) => {
        setCounts((prevCounts) => ({
            ...prevCounts,
            [roomID]: Math.max((prevCounts[roomID] || 1) - 1, 1), //never go below 0, no need just in case
        }));
    };

    // Save total price
    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
    }
    return (
        <div>
            <div className="mt-4">
                {roomData.map((room, index) => {
                    // room property
                    const returnCount = counts[room._id] || 1;
                    const countRoomPrice = room.money * returnCount;
                    const rangeRoomPrice = countRoomPrice * totalCheckInDay
                    const fees = (rangeRoomPrice * 15) / 100;
                    const totalPrice = rangeRoomPrice + fees
                    return (
                        // Display room details
                        <Row className="border-b my-12" key={`${room._id}-${index}`}>
                            <Col span={8}>
                                        <img
                                            className="object-center h-[250px] w-full rounded-md shadow-md"
                                            src={room.imgLink[0]}
                                        />
                                <h5 className="border-none mb-6 mt-2 font-[400] font-afacad text-[24px]" >{room.roomName}</h5>
                            </Col>
                            {/* Display room info */}
                            <Col span={8}>
                                <div className="py-12">
                                    <div className="pl-4 w-full">
                                        <ul className="room-info">
                                            <li>{t('type')}: {room.typeOfRoom}</li>
                                            <li>{t('capacity')}: {room.capacity} people</li>
                                            <li>{t('bed')}: {room.numberOfBeds}</li>
                                            <li>{t('roomNumb')}: {room.countRoom}</li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            {/* Display price and book button */}
                            <Col span={8}>
                                <div className="w-full h-95% p-4 border border-gray-300 shadow-md rounded-lg mb-8">
                                    {/* Count room */}
                                    <div className="flex items-center justify-center space-x-4">
                                        <Button
                                            disabled={!counts[room._id] || counts[room._id] === 1}
                                            onClick={() => decrement(room._id)}
                                        >
                                            -
                                        </Button>
                                        <div>{returnCount}</div>
                                        <Button
                                            onClick={() => increment(room._id)}
                                            disabled={counts[room._id] === room.countRoom || room.countRoom===1}
                                        >
                                            +
                                        </Button>
                                    </div>
                                    {/* Price part */}
                                    <div>
                                        <ul className="flex items-start flex-col border-b">
                                            <li className="flex justify-between w-full mb-2 mt-2">
                                            {/* <span>{t('x1')}: </span> */}
                                                <span>{t('x1')} {returnCount} {t('room')}: </span>
                                                <span>{formatMoney(countRoomPrice)} VND</span>
                                            </li>
                                            <li className="flex justify-between w-full mb-2">

                                                <span>{t('for')} <span className="text-success">{totalCheckInDay} {t('night')} </span>: </span>
                                                <span>{formatMoney(rangeRoomPrice)} VND</span>
                                            </li>
                                            <li className="flex justify-between w-full mb-2">
                                                <span>{t('taxes')}:</span>
                                                <span> {formatMoney(fees)} VND</span>
                                            </li>
                                        </ul>
                                        <div className="flex justify-between w-full mt-2">
                                            <span className="font-semibold">{t('total')}:</span>
                                            <span className="text-success"> {formatMoney(totalPrice)} VND</span>
                                        </div>
                                        {/* reserve */}
                                        <div className="mt-3" >
                                            <Button disabled={totalCheckInDay===0}
                                                    onClick={() => {
                                                        if(auth.isAuthenticated){
                                                            handleReserve(room,returnCount,totalPrice)
                                                        }else{
                                                            openNotification(false,"Reserve failed","Please log in or register account !")
                                                        }
                                                    }}
                                                    type='solid'
                                                    className={`w-full text-white ${totalCheckInDay===0? 'bg-gray-400':'bg-[#1677ff] hover:scale-105'}` }
                                            >{t('reverse')}
                                            </Button>
                                            <BookingConfirmationForm isShow={isShow} onCancel={() => setShow(false)} hotel={hotel} />

                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    );
                })}
            </div>
        </div>
    );
};

export default HotelDetail_RoomDisplay;
