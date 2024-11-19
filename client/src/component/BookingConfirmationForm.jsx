import React, { useState, useContext, useRef, forwardRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
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
  message,
  notification,
  Select
} from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import { AuthContext } from "../hooks/auth.context";
import { RateStar } from "./Rate";
import PayPalButton from "./PayPalButton";
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setInvoiceID,setVoucherApplied } from "../hooks/redux/inputDaySlice"
import { useForm } from "antd/es/form/Form";
import { setInvoiceCount,cleanInvoice } from "../hooks/redux/revenueSlice";
const {Option}=Select;
function BookingConfirmationForm({ isShow, onCancel,hotel }) {
  const { auth,setAuth } = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const [form] = useForm();
  const [payment, setPayment] = useState("");
  const [vouchers, setVouchers] = useState([]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [voucherCode, setVoucherCode] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { count, listInvoiceID } = useSelector(state => state.invoiceRevenue)
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
    firstPrice,
    completedPayment,
  } = useSelector((state) => state.inputDay);

  const a =totalPrice;
  const[price,setPrice]=useState(totalPrice);

useEffect(() => {
  setPrice(totalPrice);
}, [totalPrice]);

useEffect(() => {
  const fetchVouchers = async () => {
    try {
      const response = await axios.get(`${BE_PORT}/api/voucher/getVoucus/${hotel.ownerID}`);
      const voucherData = [
          ...(response.data.sysVou || []),
          ...(response.data.ownerVou || []),
      ];
  
      const formatVouchers = voucherData.map(voucher => ({
          code: voucher.code || '',
          name: voucher.voucherName || '',
          discount: voucher.discount || 0,
          startDay: voucher.startDay || '',
          endDay: voucher.endDay || '',
      }));
  
      setVouchers(formatVouchers);
  } catch (error) {
      console.error('Lỗi truy xuất vou:', error);
  }
  };
  fetchVouchers();
  if(voucherCode)
    applyVoucher();
}, [voucherCode]);

  // handle invoice state change spec for wowo
  useEffect(() => {
    const handlePaymentStorageChange = (e) => {
      if (e.key === 'completedPayment' && e.newValue === 'true') {
        dispatch(completedPayment(true))
        localStorage.removeItem('completedPayment')
      }
    }
    window.addEventListener('storage', handlePaymentStorageChange)
    return () => window.removeEventListener('storage', handlePaymentStorageChange)
  }, [dispatch]);

  //radio
  const paymentRef = useRef(null)

  const handlePaymentChange = (e) => {
    const selectedValue = e.target.value;
    setPayment(selectedValue);

    if (paymentRef.current) {
      paymentRef.current.scrollIntoView
        ({ behavior: 'smooth', block: 'end' })
    }
  };

  //apply vou
  const applyVoucher = () => {

    const voucher = vouchers.find(v => v.code === voucherCode);
    
    if (voucher) {
        dispatch(setVoucherApplied({ voucher }));
        notification.success({ description: 'Áp dụng voucher thành công!' });
    } else {
        notification.error({ description: 'Voucher không hợp lệ!' });
    }
};

  // inactive
  const handleInactive = async (reason) => {
    try {
      const response = await axios.put(`${BE_PORT}/api/cancelReq/inactiveCus/${auth.user.id}`, {
        reason: reason,
      });
      if (response.status) {
        message.error("Tài khoản của bạn đã bị khóa")
        const resDeleteInvoice = await axios.post(`${BE_PORT}/api/booking/deleteInvoiceWaiting`, { listID: listInvoiceID })
        dispatch(cleanInvoice())
        hanldeLogout()
      } else {
        console.log(response)
        notification.error({
          message: 'Customer Inactivation Failed',
          description: 'Customer inactivation failed!',
        });
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
    }
  };

  // logout when inactive
  const hanldeLogout = ()=>{
    axios.get(`${BE_PORT}/api/auth/logout`)
    .then(res => {
      if (res.data.logout) {
        setAuth({
          isAuthenticated: false,
          user: {
            id: "",
            email: '',
            name: '',
          }
        })
        navigate("/login")
      }
    }).catch(err => {
      console.log(err)
    })
  }

  const checkFormValidity = async () => {
    try {
      await form.validateFields()
      setIsFormValid(true)
    } catch (e) {
      setIsFormValid(false)
    }
  }

  // setCount and save orders
  const setCountOrders = (invoice, invoiceID) => {
    const state = invoice.invoiceState
    if (state == "waiting") {
      dispatch(setInvoiceCount(invoiceID))
    }
    // check nếu đặt 3 lần ko thành công
    if (count === 2) {
      message.warning("Bạn đã đặt quá 3 lần không thành công. Nếu quá 5 lần thì bạn sẽ bị khóa tài khoản")
      return
    }
  // check nếu đặt 5 lần ko thành công
    if(count === 5){
      handleInactive("Bạn bị khóa vì đặt quá 5 lần không thành công")

    }
    
  }

  //2nd modal
  const handlePaymentConfirmation = () => {
    message.success("Payment successful!");
    setPaymentModalVisible(false);
    dispatch(cleanInvoice())
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
      total: price,
      checkInDay: dayjs(dayStart),
      checkOutDay: dayjs(dayEnd),
      totalDay: totalCheckInDay,
      totalRoom: countRoom
    }
    const BE_PORT = import.meta.env.VITE_BE_PORT
    // need handle voucher
    // console.log("[INFORMATION BOOKING]", idHotel, idCus, idRoom, dataBooking);

    try {
      const response = await axios.post(`${BE_PORT}/api/booking`, {
        idHotel,
        idCus,
        idRoom,
        dataBooking,
      });
      console.log("[RESPONSE]", response.data);

      // paypal
      if (response.status === 200) {
        setCountOrders(response.data.data, response.data.invoiceID)
        // console.log('[Invoice ID]',response.data.invoiceID)
        dispatch(setInvoiceID({ invoiceID: response.data.invoiceID }))
        setPaymentModalVisible(true)
        //   wowo
      } else if (response.status === 201) {
        // console.log('check url', response.data.orderResponse.checkoutUrl)
        const checkoutUrl = response.data.orderResponse.checkoutUrl;
        if (checkoutUrl) {
          window.open(checkoutUrl, '_blank');
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

const handleCancel = () => {
  onCancel();
  setPrice(a);
  setVoucherCode(''); 
  
};
  return (
    <div>
    <Modal
        open={isShow}
        onCancel={()=>{handleCancel()}}
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
          <h3 className="text-center mt-[18px] mb-[29px] font-afacad">
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
            <div>
              <Form
                  onFinish={onFinish}
                  scrollToFirstError={true}
                  onValuesChange={checkFormValidity}
                  labelCol={{
                    span: 8,
                  }}
                  labelAlign="left"
                  form={form}
                  className="w-[550px] h-auto mr-[34px] ml-[28px] "
              >
                <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[
                      {
                        required: true,
                        message: "Please input your fullname !",
                      },
                    ]}
                >
                  <Input className="min-w-[150px]" />
                </Form.Item>
                <Form.Item
                    label="Identity Card"
                    name="idenCard"
                    rules={[
                      {
                        required: true,
                        message: "Please input your identity card !",
                      },
                      {
                        pattern: /^\d{12}$/,
                        message: "Please input true identity card!",
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
                      {
                        pattern:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                        message: "Please input valid email address!"
                      }
                    ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                    label="Phone Number"
                    name="phoneNum"
                    maxLength={9}
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number !",
                      },
                      {
                        pattern:/^[0-9\-\+]{9,15}$/,
                        message: "Please input valid phone number!"
                      }
                    ]}
                >
                  <PhoneInput
                      defaultMask="... ... ..."
                      enableLongNumbers={false}
                  ></PhoneInput>
                </Form.Item>

                <Form.Item name="dob" label="Select birthday">
                  <DatePicker className="ml-[10px]"  disabledDate={(current) => {
                    const today = new Date();
                    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
                    return current && current > eighteenYearsAgo;
                  }}
                  defaultPickerValue={dayjs().subtract(18,'year')}
                  />
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

    {/* select voucher */}
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border rounded-md flex items-center justify-between hover:bg-gray-50 focus:outline-none w-48"
      >
        <span className="text-gray-700">
          {voucherCode || "Select Voucher"}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute left-full ml-2 top-0 bg-white border rounded-md shadow-lg z-10">
          <div className="max-w-md overflow-x-auto">
            <div className="flex whitespace-nowrap">
              {vouchers.map((voucher) => (
                <div
                  key={voucher.code}
                  onClick={() => {
                    setVoucherCode(voucher.code);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center border-r last:border-r-0 shrink-0"
                >
                  <span>{voucher.name}</span>
                  <span className="text-gray-600 ml-2">Discount {voucher.discount}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

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
                className="h-auto border-[1px] px-6 pt-2 border-gray-300 rounded-[10px]"
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
                {voucherCode && (
                    <>
                      <div>
                        <span className='float-right ml-2'>VND</span>
                        <span className='text-danger line-through float-right'>{formatMoney(firstPrice)}</span>
                      </div>
                    </>
                )}
                <div className="flex justify-between">
                  <div>Total price:</div>{" "}
                  <div className="text-success">{formatMoney(price)} VND </div>
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
        <p>Your total price is {formatMoney(price)} VND which is <span className="text-success">{convertPrice} USD </span></p>

      </div>
      {payment==='paypal'? (
          <>
              <p>Please <span className="text-success">click the button</span> to confirm your payment,
                otherwise your payment will be cancel<span className="text-success"> in 20 minutes</span></p>
          <PayPalButton></PayPalButton>
          </>
        ) : ''}
      {payment === 'wowo' ? (
          <>
          <p>Please <span className="text-success">complete the payment on Wowo page,</span>
            otherwise your payment will be cancel<span className="text-success"> in 20 minutes</span></p>
          <img alt='wowopic' className='flex-center w-full h-[400px]'
                                 src='https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS1WwRPG59Xn5KZL5YsZNvHbo0Sds6gCzCYbK0tG7fAO8mh1t_H'/>
          </>
          ): ''}
    </Modal>
  </div>
  );
}

export default BookingConfirmationForm;