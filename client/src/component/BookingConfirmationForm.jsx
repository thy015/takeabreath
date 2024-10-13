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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { AuthContext } from "../hooks/auth.context";
import { RateStar } from "./Rate";

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
  <PayPalScriptProvider options={{ "client-id": process.env.CLIENT_ID }}>
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
                      {selectedPayment === "momo" && (
                        <img src="/img/momo.jpeg"></img>
                      )}
                      {selectedPayment === "visa" && (
                        // <div className="bg-[#FFC439] flex items-center justify-center w-[180px] h-[45px] mt-4">
                        // <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAxcHgiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAxMDEgMzIiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHhtbG5zPSJodHRwOiYjeDJGOyYjeDJGO3d3dy53My5vcmcmI3gyRjsyMDAwJiN4MkY7c3ZnIj48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDEyLjIzNyAyLjggTCA0LjQzNyAyLjggQyAzLjkzNyAyLjggMy40MzcgMy4yIDMuMzM3IDMuNyBMIDAuMjM3IDIzLjcgQyAwLjEzNyAyNC4xIDAuNDM3IDI0LjQgMC44MzcgMjQuNCBMIDQuNTM3IDI0LjQgQyA1LjAzNyAyNC40IDUuNTM3IDI0IDUuNjM3IDIzLjUgTCA2LjQzNyAxOC4xIEMgNi41MzcgMTcuNiA2LjkzNyAxNy4yIDcuNTM3IDE3LjIgTCAxMC4wMzcgMTcuMiBDIDE1LjEzNyAxNy4yIDE4LjEzNyAxNC43IDE4LjkzNyA5LjggQyAxOS4yMzcgNy43IDE4LjkzNyA2IDE3LjkzNyA0LjggQyAxNi44MzcgMy41IDE0LjgzNyAyLjggMTIuMjM3IDIuOCBaIE0gMTMuMTM3IDEwLjEgQyAxMi43MzcgMTIuOSAxMC41MzcgMTIuOSA4LjUzNyAxMi45IEwgNy4zMzcgMTIuOSBMIDguMTM3IDcuNyBDIDguMTM3IDcuNCA4LjQzNyA3LjIgOC43MzcgNy4yIEwgOS4yMzcgNy4yIEMgMTAuNjM3IDcuMiAxMS45MzcgNy4yIDEyLjYzNyA4IEMgMTMuMTM3IDguNCAxMy4zMzcgOS4xIDEzLjEzNyAxMC4xIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDAzMDg3IiBkPSJNIDM1LjQzNyAxMCBMIDMxLjczNyAxMCBDIDMxLjQzNyAxMCAzMS4xMzcgMTAuMiAzMS4xMzcgMTAuNSBMIDMwLjkzNyAxMS41IEwgMzAuNjM3IDExLjEgQyAyOS44MzcgOS45IDI4LjAzNyA5LjUgMjYuMjM3IDkuNSBDIDIyLjEzNyA5LjUgMTguNjM3IDEyLjYgMTcuOTM3IDE3IEMgMTcuNTM3IDE5LjIgMTguMDM3IDIxLjMgMTkuMzM3IDIyLjcgQyAyMC40MzcgMjQgMjIuMTM3IDI0LjYgMjQuMDM3IDI0LjYgQyAyNy4zMzcgMjQuNiAyOS4yMzcgMjIuNSAyOS4yMzcgMjIuNSBMIDI5LjAzNyAyMy41IEMgMjguOTM3IDIzLjkgMjkuMjM3IDI0LjMgMjkuNjM3IDI0LjMgTCAzMy4wMzcgMjQuMyBDIDMzLjUzNyAyNC4zIDM0LjAzNyAyMy45IDM0LjEzNyAyMy40IEwgMzYuMTM3IDEwLjYgQyAzNi4yMzcgMTAuNCAzNS44MzcgMTAgMzUuNDM3IDEwIFogTSAzMC4zMzcgMTcuMiBDIDI5LjkzNyAxOS4zIDI4LjMzNyAyMC44IDI2LjEzNyAyMC44IEMgMjUuMDM3IDIwLjggMjQuMjM3IDIwLjUgMjMuNjM3IDE5LjggQyAyMy4wMzcgMTkuMSAyMi44MzcgMTguMiAyMy4wMzcgMTcuMiBDIDIzLjMzNyAxNS4xIDI1LjEzNyAxMy42IDI3LjIzNyAxMy42IEMgMjguMzM3IDEzLjYgMjkuMTM3IDE0IDI5LjczNyAxNC42IEMgMzAuMjM3IDE1LjMgMzAuNDM3IDE2LjIgMzAuMzM3IDE3LjIgWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMwMDMwODciIGQ9Ik0gNTUuMzM3IDEwIEwgNTEuNjM3IDEwIEMgNTEuMjM3IDEwIDUwLjkzNyAxMC4yIDUwLjczNyAxMC41IEwgNDUuNTM3IDE4LjEgTCA0My4zMzcgMTAuOCBDIDQzLjIzNyAxMC4zIDQyLjczNyAxMCA0Mi4zMzcgMTAgTCAzOC42MzcgMTAgQyAzOC4yMzcgMTAgMzcuODM3IDEwLjQgMzguMDM3IDEwLjkgTCA0Mi4xMzcgMjMgTCAzOC4yMzcgMjguNCBDIDM3LjkzNyAyOC44IDM4LjIzNyAyOS40IDM4LjczNyAyOS40IEwgNDIuNDM3IDI5LjQgQyA0Mi44MzcgMjkuNCA0My4xMzcgMjkuMiA0My4zMzcgMjguOSBMIDU1LjgzNyAxMC45IEMgNTYuMTM3IDEwLjYgNTUuODM3IDEwIDU1LjMzNyAxMCBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA2Ny43MzcgMi44IEwgNTkuOTM3IDIuOCBDIDU5LjQzNyAyLjggNTguOTM3IDMuMiA1OC44MzcgMy43IEwgNTUuNzM3IDIzLjYgQyA1NS42MzcgMjQgNTUuOTM3IDI0LjMgNTYuMzM3IDI0LjMgTCA2MC4zMzcgMjQuMyBDIDYwLjczNyAyNC4zIDYxLjAzNyAyNCA2MS4wMzcgMjMuNyBMIDYxLjkzNyAxOCBDIDYyLjAzNyAxNy41IDYyLjQzNyAxNy4xIDYzLjAzNyAxNy4xIEwgNjUuNTM3IDE3LjEgQyA3MC42MzcgMTcuMSA3My42MzcgMTQuNiA3NC40MzcgOS43IEMgNzQuNzM3IDcuNiA3NC40MzcgNS45IDczLjQzNyA0LjcgQyA3Mi4yMzcgMy41IDcwLjMzNyAyLjggNjcuNzM3IDIuOCBaIE0gNjguNjM3IDEwLjEgQyA2OC4yMzcgMTIuOSA2Ni4wMzcgMTIuOSA2NC4wMzcgMTIuOSBMIDYyLjgzNyAxMi45IEwgNjMuNjM3IDcuNyBDIDYzLjYzNyA3LjQgNjMuOTM3IDcuMiA2NC4yMzcgNy4yIEwgNjQuNzM3IDcuMiBDIDY2LjEzNyA3LjIgNjcuNDM3IDcuMiA2OC4xMzcgOCBDIDY4LjYzNyA4LjQgNjguNzM3IDkuMSA2OC42MzcgMTAuMSBaIj48L3BhdGg+PHBhdGggZmlsbD0iIzAwOWNkZSIgZD0iTSA5MC45MzcgMTAgTCA4Ny4yMzcgMTAgQyA4Ni45MzcgMTAgODYuNjM3IDEwLjIgODYuNjM3IDEwLjUgTCA4Ni40MzcgMTEuNSBMIDg2LjEzNyAxMS4xIEMgODUuMzM3IDkuOSA4My41MzcgOS41IDgxLjczNyA5LjUgQyA3Ny42MzcgOS41IDc0LjEzNyAxMi42IDczLjQzNyAxNyBDIDczLjAzNyAxOS4yIDczLjUzNyAyMS4zIDc0LjgzNyAyMi43IEMgNzUuOTM3IDI0IDc3LjYzNyAyNC42IDc5LjUzNyAyNC42IEMgODIuODM3IDI0LjYgODQuNzM3IDIyLjUgODQuNzM3IDIyLjUgTCA4NC41MzcgMjMuNSBDIDg0LjQzNyAyMy45IDg0LjczNyAyNC4zIDg1LjEzNyAyNC4zIEwgODguNTM3IDI0LjMgQyA4OS4wMzcgMjQuMyA4OS41MzcgMjMuOSA4OS42MzcgMjMuNCBMIDkxLjYzNyAxMC42IEMgOTEuNjM3IDEwLjQgOTEuMzM3IDEwIDkwLjkzNyAxMCBaIE0gODUuNzM3IDE3LjIgQyA4NS4zMzcgMTkuMyA4My43MzcgMjAuOCA4MS41MzcgMjAuOCBDIDgwLjQzNyAyMC44IDc5LjYzNyAyMC41IDc5LjAzNyAxOS44IEMgNzguNDM3IDE5LjEgNzguMjM3IDE4LjIgNzguNDM3IDE3LjIgQyA3OC43MzcgMTUuMSA4MC41MzcgMTMuNiA4Mi42MzcgMTMuNiBDIDgzLjczNyAxMy42IDg0LjUzNyAxNCA4NS4xMzcgMTQuNiBDIDg1LjczNyAxNS4zIDg1LjkzNyAxNi4yIDg1LjczNyAxNy4yIFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMDA5Y2RlIiBkPSJNIDk1LjMzNyAzLjMgTCA5Mi4xMzcgMjMuNiBDIDkyLjAzNyAyNCA5Mi4zMzcgMjQuMyA5Mi43MzcgMjQuMyBMIDk1LjkzNyAyNC4zIEMgOTYuNDM3IDI0LjMgOTYuOTM3IDIzLjkgOTcuMDM3IDIzLjQgTCAxMDAuMjM3IDMuNSBDIDEwMC4zMzcgMy4xIDEwMC4wMzcgMi44IDk5LjYzNyAyLjggTCA5Ni4wMzcgMi44IEMgOTUuNjM3IDIuOCA5NS40MzcgMyA5NS4zMzcgMy4zIFoiPjwvcGF0aD48L3N2Zz4"></img>
                        // </div>
                          <PayPalButtons></PayPalButtons>
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
          {/* information*/}
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
                <p>Room price: {room.money} VND</p>
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
      </PayPalScriptProvider>
    </div>
  );
}

export default BookingConfirmationForm;
