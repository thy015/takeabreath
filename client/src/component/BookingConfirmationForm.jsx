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

function BookingConfirmationForm({isShow, onCancel}) {
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
      //redux query
      const {
        dayStart,
        dayEnd,
        totalCheckInDay,
        selectedHotel,
        selectedRoom,
        totalPrice,
        convertPrice,
        countRoom,
        completedPayment,
      } = useSelector((state) => state.inputDay);

  const handlePaymentChange = (e) => {
    const selectedValue = e.target.value;
    setPayment(selectedValue);
    setSelectedPayment(selectedValue);
  };

  const onFinish = async (values) => {
    const idHotel = selectedHotel._id;
    const idRoom = selectedRoom._id;
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
        onOk={(handleOke)}
      >
        <h2 className="text-center font-semibold font-poppins"> TAB Booking Detail</h2>
        <Row className="h-[520px] " wrap={true} gutter={24}>
          {/* input form */}
          <Col
            span={16}
            className="border-[1px] p-6 h-[520px] border-gray-300 rounded-[10px] min-w-[550px]"
          >
            <h3 className="text-center mt-[18px] mb-[29px] font-poppins">
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
                          <div className="mt-8">
                            Click the button below to complete the payment
                          </div>
                        </div>
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
          <Col span={8} >
              {/* information hotel */}
              <div className="flex flex-col space-y-4">
              <div className=" p-7 h-[170px] border-[1px] border-gray-300 rounded-[10px]"
              >
                {" "}
                <div className="flex space-x-5">
                  <h4 className="font-lobster">{selectedHotel.hotelName}</h4>
                  <RateStar hotel={selectedHotel}></RateStar>{" "}
                </div>
                <p className="text-[16px] mb-[5px]">
                  {selectedHotel.address}, {selectedHotel.city},{" "}
                  {selectedHotel.nation}
                </p>
                <div className="text-[16px]">
                  Hotel Number: {selectedHotel.phoneNum}
                </div>
              </div>
              {/* information rooms */}
              <div
                className="h-[150px] p-6 border-[1px] border-gray-300 rounded-[10px]"
              >
                <p className="text-[15px] mb-[5px]  mt-[2px]">
                  Room contain {selectedRoom.capacity} people
                </p>
                <p className="text-[16px] mb-[5px]">
                  <b>{selectedRoom.roomName}</b>
                </p>

                <div className="flex space-x-5">
                  <span>Type: {selectedRoom.typeOfRoom}</span>
                  <span>{selectedRoom.numberOfBeds} Bed</span>
                  <span>Room price: {formatMoney(selectedRoom.money)} VND</span>
                </div>
              </div>
              {/* information booking */}
              <div
                className="h-[150px] border-[1px] px-6 pt-2 border-gray-300 rounded-[10px]"
              >
                <Row>
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
                <div className="flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>Total length of day: </div>{" "}
                    <div>{totalCheckInDay} days</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Total room: </div>
                    <div>
                      {countRoom} {countRoom === 1 ? "room" : "rooms"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Total price:</div>{" "}
                    <div className="text-success">{formatMoney(totalPrice)} VND </div>
                  </div>
                </div>
              </div>
           </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default BookingConfirmationForm;
