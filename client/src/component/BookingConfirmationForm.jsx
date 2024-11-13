import React, {useState, useContext, useRef, forwardRef} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Modal,
  Col,
  Row,
  Form,
  Input,
  ConfigProvider,
  DatePicker,
  Radio,
  message
} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import { AuthContext } from "../hooks/auth.context";
import { RateStar } from "./Rate";
import PayPalButton from "./PayPalButton";
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {setInvoiceID} from "../hooks/redux/inputDaySlice"
import {useForm} from "antd/es/form/Form";
function BookingConfirmationForm({isShow, onCancel}) {
  const { auth } = useContext(AuthContext);
  const [form] = useForm();
  const [payment, setPayment] = useState("");
  const [paymentModalVisible,setPaymentModalVisible]=useState(false)
  const [isFormValid,setIsFormValid]=useState(false)
  const navigate=useNavigate()
  const dispatch=useDispatch()

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

  //radio
  const paymentRef=useRef(null)

  const handlePaymentChange = (e) => {
    const selectedValue = e.target.value;
    setPayment(selectedValue);

    if(paymentRef.current){
      paymentRef.current.scrollIntoView
      ({behavior:'smooth', block:'end'})
    }
  };

  const checkFormValidity=async()=>{
    try{
      await form.validateFields()
      setIsFormValid(true)
    }catch(e){
      setIsFormValid(false)
    }
  }
  //2nd modal
  const handlePaymentConfirmation = () => {
    message.success("Payment successful!");
    setPaymentModalVisible(false);
    navigate('/mybooking')
    onCancel();
  };
  const onFinish = async (values) => {
    const idHotel = selectedHotel._id;
    const idRoom = selectedRoom._id;
    const idCus = auth.user.id ?? "Chua login";
    const dataBooking =
        {
          inputName: values.fullname,
          inputIdenCard: values.idenCard,
          inputGender: values.gender,
          paymentMethod: values.paymentMethod,
          inputPhoneNum: values.phoneNum,
          inputEmail: values.email,
          inputDob: dayjs(values.dob),
          total: totalPrice,
          checkInDay: dayjs(dayStart),
          checkOutDay: dayjs(dayEnd),
          totalDay: totalCheckInDay,
          totalRoom:countRoom
        }
    const BE_PORT=import.meta.env.VITE_BE_PORT
    // need handle voucher
    console.log("[INFORMATION BOOKING]", idHotel, idCus, idRoom, dataBooking);

    try {
      const response = await axios.post(`${BE_PORT}/api/booking`, {
        idHotel,
        idCus,
        idRoom,
        dataBooking,
      });
      console.log("[RESPONSE]", response.data);
      // paypal
      if(response.status===200){
        console.log('[Invoice ID]',response.data.invoiceID)
        dispatch(setInvoiceID({invoiceID:response.data.invoiceID}))
        setPaymentModalVisible(true)
      //   wowo
      } else if(response.status===201){
        console.log('check url', response.data.orderResponse.checkoutUrl)
        const checkoutUrl = response.data.orderResponse.checkoutUrl;
        if (checkoutUrl) {
          window.open(checkoutUrl,'_blank');
          setPaymentModalVisible(true)
        } else {
          message.error("WoWo checkout URL is missing.");
        }
      }
      else {
        message.error("Booking failed", message.error(response.data.message));
      }
    } catch (e) {
      console.log(e)
      console.log("[ERROR]", e.response.message);
    }

  };

  return (
      <div>
        <Modal
            open={isShow}
            onCancel={onCancel}
            className="min-w-[80%] max-h-[100px]"
            okText="Confirm Booking"
            onOk={()=>form.submit()}
            okButtonProps={{
              disabled:!isFormValid,
              className: isFormValid
                  ?"bg-[#114098] text-white text-lg py-3 px-6"
                  : 'text-black text-lg py-3 px-6 bg-grey-500' ,
            }}
            cancelButtonProps={{className:'py-3 px-6 text-lg'}}
        >
          <h2 className="text-center font-semibold font-poppins"> TAB Booking Detail</h2>
          <Row className="h-auto " wrap={true} gutter={24}>
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
                      onFinish={onFinish}
                      scrollToFirstError={true}
                      onValuesChange={checkFormValidity}
                      labelCol={{
                        span: 8,
                      }}
                      labelAlign="left"
                      form={form}
                      className="w-[550px] h-[500px] mr-[34px] ml-[28px] "
                  >
                    <Form.Item
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
                    </Form.Item>
                    <Form.Item
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
                    </Form.Item>
                    <Form.Item
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
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNum"
                        maxLength={10}
                        rules={[
                          {
                            required: true,
                            message: "Please input your phone number !",
                          },
                        ]}
                    >
                      <PhoneInput
                          defaultMask="... ... ... ."
                          enableLongNumbers={false}
                      ></PhoneInput>
                    </Form.Item>

                    <Form.Item name="dob" label="Select birthday">
                      <DatePicker className="ml-[10px]" />
                    </Form.Item>

                    <Form.Item name="gender" label="Select gender">
                      <Radio.Group className="ml-[10px]">
                        <Radio value="male">Male</Radio>
                        <Radio value="female">Female</Radio>
                        <Radio value="unknown">Secret</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="paymentMethod"
                        label="Select payment method"
                        ref={paymentRef}
                    >
                      <Radio.Group
                          className="ml-[10px]"
                          onChange={handlePaymentChange}
                      >
                        <Radio
                            value="paypal"
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
                        <Radio
                            value="wowo"
                            onClick={() => {
                              setPayment("wowo");
                            }}
                        >
                          Wowo
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Form>
                </div>
              </ConfigProvider>
            </Col>
            {/* information */}
            <Col span={8} >
              {/* information hotel */}
              <div className="flex flex-col space-y-4">
                <div className=" p-7 h-auto border-[1px] border-gray-300 rounded-[10px]"
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
        {/* confirm modal pop up after click confirm booking --2nd modal*/}
        <Modal
            open={paymentModalVisible}
            title={<div className="text-center font-lobster text-[26px] font-light">Payment Confirmation</div>}
            onCancel={()=>setPaymentModalVisible(false)}
            onOk={handlePaymentConfirmation}
            okButtonProps={{
              disabled:!completedPayment,
              className: completedPayment
                  ?"bg-success text-white text-lg py-3 px-6"
                  : 'text-black text-lg py-3 px-6 bg-grey-500' ,
            }}
        >
          <div className="text-center p-2 text-[16px]">
            <p>Confirm your payment using {payment}</p>
            <p>Your total price is {formatMoney(totalPrice)} VND which is <span className="text-success">{convertPrice} USD </span></p>
            <p>Please  <span className="text-success">click the button</span> to confirm your payment,
              otherwise your payment will be cancel<span className="text-success"> in 20 minutes</span></p>
          </div>
          {payment==='paypal'? <PayPalButton></PayPalButton> : ''}
          {payment==='wowo'? <img alt='wowopic' className='items-center flex'
                                  src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS1WwRPG59Xn5KZL5YsZNvHbo0Sds6gCzCYbK0tG7fAO8mh1t_H'/>: ''}
        </Modal>
      </div>
  );
}

export default BookingConfirmationForm;
