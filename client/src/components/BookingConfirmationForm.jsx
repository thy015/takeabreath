import React from 'react'
import {useState, useRef, useEffect} from "react"
import axios from "axios"
import dayjs from "dayjs"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {useSelector} from "react-redux"
import {RateStar} from "./Rate"
import PayPalButton from "./PayPalButton"
import {useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
import {useTranslation} from "react-i18next"
import {ChevronDown, CalendarIcon} from "lucide-react"
import PropTypes from "prop-types"
import {cleanInvoice, setInvoiceCount} from "@/store/redux/revenueSlice"
import {setInvoiceID, setVoucherApplied} from "@/store/redux/inputDaySlice"
import {useToastNotifications} from "@/hooks/useToastNotification"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {useForm, Controller} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {bookingSchema} from "@/lib/validators/booking/booking-validate";

function BookingConfirmationForm ({isShow, onCancel, hotel}) {
  BookingConfirmationForm.propTypes = {
    isShow: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    hotel: PropTypes.object.isRequired,
  }

  const {t} = useTranslation ()
  const BE_PORT = import.meta.env.VITE_BE_PORT

  // Form state
  const [payment, setPayment] = useState ("")
  const [vouchers, setVouchers] = useState ([])
  const [paymentModalVisible, setPaymentModalVisible] = useState (false)
  const [isFormValid, setIsFormValid] = useState (false)
  const [voucherCode, setVoucherCode] = useState ("")
  const [isOpen, setIsOpen] = useState (false)
  const [datePickerOpen, setDatePickerOpen] = useState (false)

  const navigate = useNavigate ()
  const dispatch = useDispatch ()
  const {count, listInvoiceID} = useSelector ((state) => state.invoiceRevenue)
  const auth = useSelector ((state) => state.auth)
  const toast = useToastNotifications ()

  const formatMoney = (money) => {
    return new Intl.NumberFormat ("de-DE").format (money)
  }

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
  } = useSelector ((state) => state.inputDay)

  const [price, setPrice] = useState (totalPrice)

  useEffect (() => {
    setPrice (totalPrice)
  }, [totalPrice])

  useEffect (() => {
    if (!auth) {
      console.error ("Auth is undefined or not available in Redux state.");
    }
  }, [auth]);

  useEffect (() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get (`${BE_PORT}/api/voucher/getVoucus/${hotel.ownerID}`)
        const voucherData = [...(response.data.sysVou || []), ...(response.data.ownerVou || [])]
        const formatVouchers = voucherData.map ((voucher) => ({
          code: voucher.code || "",
          name: voucher.voucherName || "",
          discount: voucher.discount || 0,
          startDay: voucher.startDay || "",
          endDay: voucher.endDay || "",
        }))
        setVouchers (formatVouchers)
      } catch (error) {
        console.error ("Lỗi truy xuất vou:", error)
      }
    }
    fetchVouchers ()
    if (voucherCode) applyVoucher ()
  }, [voucherCode])

  // React Hook Form setup - UPDATE THIS SECTION
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting, isValid},
  } = useForm ({
    resolver: zodResolver (bookingSchema),
    mode: "onChange", // Enable real-time validation
    defaultValues: {
      fullname: "",
      idenCard: "",
      email: "",
      phoneNum: "",
      dob: null,
      gender: "",
      paymentMethod: "",
    },
  })

  //radio
  const paymentRef = useRef (null)

  //apply vou
  const applyVoucher = () => {
    const voucher = vouchers.find ((v) => v.code === voucherCode)
    if (voucher) {
      dispatch (setVoucherApplied ({voucher}))
      toast.showSuccess ("Applying voucher successfully!")
    } else {
      toast.showError ("Applying voucher failed!")
    }
  }

  //radio - add this function
  const handlePaymentChange = (value) => {
    setPayment (value)
    if (paymentRef.current) {
      paymentRef.current.scrollIntoView ({behavior: "smooth", block: "end"})
    }
  }

  useEffect (() => {
    setIsFormValid (isValid && Object.keys (errors).length === 0)
  }, [isValid, errors])

  // inactive
  const handleInactive = async (reason) => {
    try {
      const response = await axios.put (`${BE_PORT}/api/cancelReq/inactiveCus/${auth.id}`, {
        reason: reason,
      })
      if (response.status) {
        toast.showError ("Tài khoản của bạn đã bị khóa")
        await axios.post (`${BE_PORT}/api/booking/deleteInvoiceWaiting`, {
          listID: listInvoiceID,
        })
        dispatch (cleanInvoice ())
      } else {
        console.log (response)
        toast.showError ("Customer Inactivation Failed")
      }
    } catch (error) {
      console.log (error.response?.data?.message || "An unknown error occurred.")
    }
  }

  // setCount and save orders
  const setCountOrders = (invoice, invoiceID) => {
    const state = invoice.invoiceState
    if (state === "waiting") {
      dispatch (setInvoiceCount (invoiceID))
    }
    // check nếu đặt 3 lần ko thành công
    if (count === 2) {
      toast.showWarning ("Bạn đã đặt quá 3 lần không thành công. Nếu quá 5 lần thì bạn sẽ bị khóa tài khoản")
      return
    }
    // check nếu đặt 5 lần ko thành công
    if (count === 5) {
      handleInactive ("Bạn bị khóa vì đặt quá 5 lần không thành công")
    }
  }

  //2nd modal
  const handlePaymentConfirmation = () => {
    toast.showSuccess ("Payment successful!")
    setPaymentModalVisible (false)
    dispatch (cleanInvoice ())
    navigate ("/mybooking")
    onCancel ()
  }

  // UPDATE the onSubmit function to include your original logic:
  const onSubmit = async (data) => {
    const idHotel = selectedHotel._id
    const idRoom = selectedRoom._id
    const idCus = auth.id
    const dataBooking = {
      inputName: data.fullname,
      inputIdenCard: data.idenCard,
      inputGender: data.gender,
      paymentMethod: data.paymentMethod,
      inputPhoneNum: data.phoneNum,
      inputEmail: data.email,
      inputDob: dayjs (data.dob),
      total: price,
      checkInDay: dayjs (dayStart),
      checkOutDay: dayjs (dayEnd),
      totalDay: totalCheckInDay,
      totalRoom: countRoom,
    }
    console.log ('auth Id', auth.id)
    try {
      const response = await axios.post (`${BE_PORT}/api/booking`, {
        idHotel,
        idCus,
        idRoom,
        dataBooking,
      })
      console.log ("[RESPONSE]", response.data)

      if (response.status === 200) {
        setCountOrders (response.data.data, response.data.invoiceID)
        dispatch (setInvoiceID ({invoiceID: response.data.invoiceID}))
        setPaymentModalVisible (true)
      } else if (response.status === 209) {
        toast.showError ("Booking failed: " + response.data.message)
      } else {
        toast.showError ("Booking failed: " + response.data.message)
      }
    } catch (e) {
      console.log (e)
      console.log ("[ERROR]", e.response?.message)
      toast.showError (e.response?.data?.message || "Booking failed")
    }
  }

  return (
    <div>
      <Dialog open={isShow} onOpenChange={onCancel}>
        <DialogContent className="max-w-[80vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center font-semibold text-[#114098] font-monospace">{t ("form")}</DialogTitle>
          </DialogHeader>

          <div className="flex gap-6 h-full">
            {/* Input form */}
            <div
              className="flex-[2] items-center flex-center flex-col border-2 p-6 border-[#114098] rounded-[10px] min-w-[550px]">
              <h3 className="text-center font-monospace font-semibold text-lg mb-4">{t ("detail")}</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label htmlFor="fullname" className="text-right">
                    {t ("Fullname")}
                  </Label>
                  <div className="col-span-2">
                    <Controller
                      name="fullname"
                      control={control}
                      render={({field}) => (
                        <Input
                          id="fullname"
                          placeholder={t ("Fullname")}
                          {...field}
                          className={cn (errors.fullname && "border-red-500")}
                          style={{width: '90%'}}

                        />
                      )}
                    />
                    {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname?.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label htmlFor="idenCard" className="text-right">
                    {t ("identity")}
                  </Label>
                  <div className="col-span-2">
                    <Controller
                      name="idenCard"
                      control={control}
                      render={({field}) => (
                        <Input
                          id="idenCard"
                          placeholder={t ("identity")}
                          {...field}
                          className={cn (errors.idenCard && "border-red-500")}
                          style={{width: '90%'}}
                        />
                      )}
                    />
                    {errors.idenCard && <p className="text-red-500 text-sm mt-1">{errors.idenCard?.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-2">
                    <Controller
                      name="email"
                      control={control}
                      render={({field}) => (
                        <Input
                          id="email"
                          type="email"
                          placeholder={auth.email !== "" ? auth.email : "Email"}
                          {...field}
                          className={cn (errors.email && "border-red-500")}
                          style={{width: '90%'}}
                        />
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label htmlFor="phoneNum" className="text-right">
                    {t ("phone")}
                  </Label>
                  <div className="col-span-2">
                    <Controller
                      name="phoneNum"
                      control={control}
                      render={({field}) => (
                        <PhoneInput
                          defaultMask="... ... ..."
                          enableLongNumbers={false}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.phoneNum && <p className="text-red-500 text-sm mt-1">{errors.phoneNum?.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-right">{t ("birthday")}</Label>
                  <div className="col-span-2">
                    <Controller
                      name="dob"
                      control={control}
                      render={({field}) => (
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn (
                                "w-full justify-start text-left",
                                !field.value && "text-muted-foreground",
                              )}
                              style={{width: '90%'}}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4"/>
                              {field.value ? dayjs (field.value).format ("DD/MM/YYYY") : t ("date")}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              captionLayout='dropdown'
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange (date)
                                setDatePickerOpen (false)
                              }}
                              defaultMonth={new Date (new Date ().getFullYear () - 18, 0, 1)} // Focus on 18 years ago
                              disabled={(date) => {
                                const today = new Date ()
                                const eighteenYearsAgo = new Date (
                                  today.getFullYear () - 18,
                                  today.getMonth (),
                                  today.getDate (),
                                )
                                return date > eighteenYearsAgo
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob?.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-right">{t ("gender")}</Label>
                  <div className="col-span-2">
                    <Controller
                      name="gender"
                      control={control}
                      render={({field}) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male"/>
                            <Label htmlFor="male">{t ("male")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female"/>
                            <Label htmlFor="female">{t ("female")}</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unknown" id="unknown"/>
                            <Label htmlFor="unknown">{t ("secret")}</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center" ref={paymentRef}>
                  <Label className="text-right">{t ("payment")}</Label>
                  <div className="col-span-2">
                    <Controller
                      name="paymentMethod"
                      control={control}
                      render={({field}) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange (value)
                            handlePaymentChange (value) // Add this line
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal"/>
                            <Label htmlFor="paypal">Paypal</Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                {/* Voucher selector */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-right">Voucher</Label>
                  <div className="col-span-2 relative">
                    <Button variant="outline" onClick={() => setIsOpen (!isOpen)} className="w-48 justify-between">
                      <span>{voucherCode || t ("voucher")}</span>
                      <ChevronDown className="w-4 h-4"/>
                    </Button>
                    {isOpen && (
                      <div className="absolute left-full ml-2 top-0 bg-white border rounded-md shadow-lg z-10">
                        <div className="max-w-md overflow-x-auto">
                          <div className="flex whitespace-nowrap">
                            {vouchers.map ((voucher) => (
                              <div
                                key={voucher.code}
                                onClick={() => {
                                  setVoucherCode (voucher.code)
                                  setIsOpen (false)
                                }}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center border-r last:border-r-0 shrink-0"
                              >
                                <span>{voucher.name}</span>
                                <span className="text-gray-600 ml-2">
                                  {t ("discount")} {voucher.discount}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Information */}
            <div className="flex-1 flex flex-col space-y-4">
              {/* Hotel information */}
              <div className="p-7 border-2 border-[#114098] rounded-[10px]">
                <div className="flex space-x-5 mb-2">
                  <h4 className="font-lobster">{selectedHotel.hotelName}</h4>
                  <RateStar hotel={selectedHotel}/>
                </div>
                <p className="text-[16px] mb-[5px]">
                  {selectedHotel.address}, {selectedHotel.city}, {selectedHotel.nation}
                </p>
                <div className="text-[16px]">
                  {t ("hotelphone")}: {selectedHotel.phoneNum}
                </div>
              </div>

              {/* Room information */}
              <div className="p-6 border-2 border-[#114098] rounded-[10px]">
                <p className="text-[15px] mb-[5px] mt-[2px]">
                  {t ("contain")} {selectedRoom.capacity} {t ("nguoi")}
                </p>
                <p className="text-[16px] mb-[5px]">
                  <b>{selectedRoom.roomName}</b>
                </p>
                <div className="flex space-x-5">
                  <span>
                    {t ("loai")}: {selectedRoom.typeOfRoom}
                  </span>
                  <span>
                    {selectedRoom.numberOfBeds} {t ("bedd")}
                  </span>
                  <span>
                    {t ("roomprice")}: {formatMoney (selectedRoom.money)} VND
                  </span>
                </div>
              </div>

              {/* Booking information */}
              <div
                className="h-[250px] flex justify-center flex-col border-2 px-6 pt-2 border-[#114098] rounded-[10px]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {t ("checkin")}
                    <p>
                      <b>{dayjs (dayStart).format ("DD/MM/YYYY")}</b>
                    </p>
                  </div>
                  <div>
                    {t ("checkout")}
                    <p>
                      <b>{dayjs (dayEnd).format ("DD/MM/YYYY")}</b>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  <div className="flex justify-between">
                    <div>{t ("totalday")}:</div>
                    <div>
                      {totalCheckInDay} {t ("day")}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>{t ("totalroom")}:</div>
                    <div>
                      {countRoom} {t ("room")}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>{t ("price")}:</div>
                    <div className="flex flex-col items-end">
                      <div className="text-green-600">{formatMoney (price)} VND</div>
                      {voucherCode && (
                        <div className="text-red-500 line-through">{formatMoney (firstPrice)} VND</div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit (onSubmit)} // Change from onClick={onSubmit}
              disabled={!isFormValid || isSubmitting}
              className={cn (
                "text-lg py-3 px-6",
                isFormValid && !isSubmitting
                  ? "bg-[#114098] text-white hover:bg-[#0d3580]"
                  : "bg-gray-500 text-black cursor-not-allowed",
              )}
            >
              {isSubmitting ? "Processing..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment confirmation modal */}
      <Dialog open={paymentModalVisible} onOpenChange={setPaymentModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center font-lobster text-[26px] font-light">{t ("confirmation")}</DialogTitle>
          </DialogHeader>

          <div className="text-center p-2 text-[16px] space-y-2">
            <p>
              {t ("1st")} {payment}
            </p>
            <p>
              {t ("2nd")} {formatMoney (price)} {t ("3rd")} <span className="text-green-600">{convertPrice} USD</span>
            </p>
          </div>

          {payment === "paypal" && (
            <div className="space-y-2">
              <p>
                {t ("please")} <span className="text-green-600">{t ("click")}</span> {t ("confirmur")}
                <span className="text-green-600"> {t ("time")}</span>
              </p>
              <PayPalButton/>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentModalVisible (false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePaymentConfirmation}
              disabled={!completedPayment}
              className={cn (
                "text-lg py-3 px-6",
                completedPayment
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-500 text-black cursor-not-allowed",
              )}
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BookingConfirmationForm
