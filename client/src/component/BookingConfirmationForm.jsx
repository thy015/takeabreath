import React, { useState, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Modal,
  Col,
  Row,
  Form,
  Input,
  ConfigProvider,
  Select,
  DatePicker,
  Radio,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useForm } from "antd/es/form/Form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import { AuthContext } from "../hooks/auth.context";
import { RateStar } from "./Rate";
import PayPalButton from "./PayPalButton";

function BookingConfirmationForm({
  isShow,
  onCancel,
  room,
  hotel,
  count,
  totalPrice,
}) {
  const { auth } = useContext(AuthContext);
  const [form] = useForm();
  const [payment, setPayment] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
   
  const handleOke = () => {
    form.submit();
  };
  const formatMoney = (money) => {
    return new Intl.NumberFormat("de-DE").format(money);
  };
  const { dayStart, dayEnd, totalCheckInDay } = useSelector(
    (state) => state.inputDay
  );
  const handlePaymentChange = (e) => {
    const selectedValue = e.target.value;
    setPayment(selectedValue);
    setSelectedPayment(selectedValue);
  };

  const onFinish = async (values) => {
    const idHotel = hotel._id;
    const idRoom = room._id;
    const idCus = auth.user.id ?? "Chua login";
    const dataBooking = {
      inputName: values.fullname,
      inputIdenCard: values.idenCard,
      inputGender: values.gender,
      paymentMethod: values.paymentMethod,
      inputPhoneNum: values.numberphone,
      inputEmail: values.email,
      inputDob: dayjs(values.dob).format("DD/MM/YYYY"),
      total: totalPrice,
      checkInDay: dayjs(dayStart).format("DD/MM/YYYY"),
      checkOutDay: dayjs(dayEnd).format("DD/MM/YYYY"),
      totalDay: totalCheckInDay,
    };

    console.log("[INFORMATION BOOKING]", idHotel, idCus, idRoom, dataBooking);
    try {
      const res = await axios.post("http://localhost:4000/api/bookRoom", {
        idHotel,
        idCus,
        idRoom,
        dataBooking,
      });
      console.log("[RESPONSE]", res);
      if (res.status === 200) {
        navigate("/booking-success");
      } else {
        message.error("Booking failed", message.error(res.data.message));
      }
    } catch (e) {
      console.log("[ERROR]", e);
    }
  };

  return (
    <div>

      <Modal
        open={isShow}
        onCancel={onCancel}
        className="min-w-[80%] max-h-[100px]"
        okText="Confirm Booking"
        onOk={handleOke}
      >
        <h2 className="text-center font-bold">Booking Detail</h2>
        <Row className="h-[520px] " wrap={true}>
          {/* input form */}
          <Col
            span={16}
            className="border-[1px] p-[10px] h-[520px] border-gray-300 rounded-[10px] min-w-[550px]"
          >
            <h3 className="text-center mt-[18px]  mb-[29px]">
              Enter your details
            </h3>
            <ConfigProvider
              theme={{
                components: {
                  Form: {
                    labelColor: "black",
                  },
                },
              }}
            >
              <div style={{ overflowY: "auto", height: "400px" }}>
                <Form
                  scrollToFirstError={true}
                  onFinish={onFinish}
                  labelCol={{
                    span: 8,
                  }}
                  labelAlign="left"
                  form={form}
                  className="w-[550px] h-[500px] mr-[34px] ml-[28px] "
                >
                  <FormItem
                    label="Fullname"
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fullname !s",
                      },
                    ]}
                  >
                    <Input className="min-w-[150px]" />
                  </FormItem>
                  <FormItem
                    label="Identification Card"
                    name="idenCard"
                    rules={[
                      {
                        required: true,
                        message: "Please input your CCCD !",
                      },
                    ]}
                  >
                    <Input className="min-w-[150px]" />
                  </FormItem>
                  <FormItem
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your email !",
                      },
                    ]}
                  >
                    <Input />
                  </FormItem>

                  <FormItem
                    label="Phone Number"
                    name="numberphone"
                    maxLength={10}
                    rules={[
                      {
                        required: true,
                        message: "Please input your numberphone !",
                      },
                    ]}
                  >
                    <PhoneInput
                      defaultMask="... ... ... ."
                      enableLongNumbers={false}
                    ></PhoneInput>
                  </FormItem>

                  <FormItem name="dob" label="Select birthday">
                    <DatePicker className="ml-[10px]" />
                  </FormItem>

                  <FormItem name="gender" label="Select gender">
                    <Radio.Group className="ml-[10px]">
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                    </Radio.Group>
                  </FormItem>

                  <FormItem
                    name="paymentMethod"
                    label="Select payment method"
                    paymentMethod={payment}
                  >
                    <Radio.Group
                      className="ml-[10px]"
                      onChange={handlePaymentChange}
                    >
                      <Radio
                        value="visa"
                        onClick={() => {
                          setPayment("paypal");
                        }}
                      >
                        Paypal
                      </Radio>
                      <Radio
                        value="momo"
                        onClick={() => {
                          setPayment("momo");
                        }}
                      >
                        Momo
                      </Radio>
                      {/* choosing payment */}
                      {selectedPayment === "momo" && (
                        <img src="/img/momo.jpeg"></img>
                      )}
                      {selectedPayment === "visa" && (                    
                      <div>  
                           <PayPalButton></PayPalButton>
                      <div className="mt-8">Click the button below to complete the payment</div></div>
                      )}
                    </Radio.Group>
                  </FormItem>
                  <FormItem
                    name="voucher"
                    label="Select voucher"
                    className="mb-[10px]"
                  >
                    <Select>
                      <Option key="1" value="Voucher 1 ">
                        Voucher 1
                      </Option>
                      <Option key="2" value="Voucher 2">
                        Voucher 1
                      </Option>
                      <Option key="3" value="Voucher 3">
                        Voucher 1
                      </Option>
                    </Select>
                  </FormItem>
                </Form>
              </div>
            </ConfigProvider>
          </Col>
          {/* information */}
          <Col span={8}>
            <Row className="d-flex justify-center items-center">
              {/* information hotel */}
              <Col
                span={24}
                className=" mb-[25px] p-[10px] h-[170px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]"
              >
                <p className="text-[15px] mb-[5px]  mt-[2px]">
                  Hotel
                  <span className="ml-[10px]">
                    <RateStar hotel={hotel}></RateStar>
                  </span>
                </p>
                <p className="text-[16px] mb-[5px]">
                  <b>{hotel.hotelName}</b>
                </p>
                <p className="text-[16px] mb-[5px]">{hotel.address}</p>
                <div className="mb-[5px]">
                  <span className="mr-[20px]">Nation: {hotel.nation}</span>
                  <span>City: {hotel.city}</span>
                </div>
                <p>Phone: {hotel.phoneNum}</p>
              </Col>
              {/* information rooms */}
              <Col
                span={24}
                className="h-[150px] mb-[25px] p-[10px] max-w-[90%] border-[1px] border-gray-300 rounded-[10px]"
              >
                <p className="text-[15px] mb-[5px]  mt-[2px]">
                  Room for {room.capacity} people
                </p>
                <p className="text-[16px] mb-[5px]">
                  <b>{room.roomName}</b>
                </p>

                <div className="mb-[5px]">
                  <span className="mr-[20px]">
                    Type of room: {room.typeOfRoom}
                  </span>
                  <span>Beds: {room.numberOfBeds}</span>
                </div>
                <p>Room price: {formatMoney(room.money)} VND</p>
              </Col>
              {/* information booking */}
              <Col
                span={24}
                className="h-[150px] border-[1px] p-[10px] max-w-[90%] border-gray-300 rounded-[10px] mb-[25px]"
              >
                <Row className="mb-[5px] max-h-[45px]">
                  <Col
                    span={11}
                    className="border-r-[1px] border-y-slate-400 mr-[11px]"
                  >
                    Check In
                    <p>
                      <b> {dayjs(dayStart).format("DD/MM/YYYY")}</b>
                    </p>
                  </Col>

                  <Col span={12}>
                    Check Out
                    <p>
                      <b>{dayjs(dayEnd).format("DD/MM/YYYY")}</b>
                    </p>
                  </Col>
                </Row>
                <div className="mb-[5px]">{/* You select {count} rooms */}</div>
                <div className="mb-[5px]">
                  <b>Total length of day: </b> {totalCheckInDay} days
                </div>
                <div className="mb-[5px]">
                  <b>Total room: </b> {count ?? "1"} rooms
                </div>
                <div className="mb-[5px]">
                  <b>Total price: </b> {formatMoney(totalPrice)} VND
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    
    </div>
  );
}

export default BookingConfirmationForm;
