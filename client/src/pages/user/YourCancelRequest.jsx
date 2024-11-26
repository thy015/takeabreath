import React, {useContext, useEffect} from 'react'
import {AuthContext} from "../../hooks/auth.context";
import {Alert, Select, Spin} from "antd";
import { useDispatch,useSelector } from 'react-redux';
import {useGet} from "../../hooks/hooks";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { filterSort, setCancel } from '../../hooks/redux/cancelSlice';
// cancel req state
const ChangeStateColor=({state})=>{
    let styleColor={
        color: state ==='Processing' ?  '#d59e00'
            : state ==='Accepted'?'green'
                :state==='Rejected'?'red'
                    :'black'
    }
    return(
        <div style={styleColor}>
            {state}
        </div>
    )
}
const YourCancelRequest = () => {
    const {auth}=useContext(AuthContext)
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const id=auth?.user?.id
    const cancelTemps=  useSelector(state=>state.cancel.cancelTemps)
    const cancel=  useSelector(state=>state.cancel.cancel)

    const dispatch = useDispatch()
    dayjs.extend(utc);
    dayjs.extend(timezone);
    if (!id) {
        return <Alert message="Please try sign in first" type="info" showIcon />;
    }
    const {data,error,loading}=useGet(`${BE_PORT}/api/cancelReq/${id}/cancelRequest`);
    useEffect(()=>{
        dispatch(setCancel(data.data))
    },[data])

    const handleSort = (value)=>{
        const valueSet = {
            value,
            cancel
        }
        dispatch(filterSort(valueSet))
    }

    const options = [
        {
          label: "Mặc định",
          value: "default"
        },
        {
          label: "Xác nhận",
          value: "accepted"
        },
        {
          label: "Từ chối",
          value: "rejected"
        },
        {
          label: "Đang xử lý",
          value: "processing"
        },
      ]

    if (loading) {
        return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
    }

    if (error ||data.length===0 || !data) {
        return <Alert message="Notice" description="You haven't make any cancel request." type="info" showIcon />;
    }
    const formatMoney = (money) => {
        return new Intl.NumberFormat('de-DE').format(money)
    }
    console.log(cancelTemps)
    return (
        <>

            <div className='w-full text-start font-afacad text-2xl absolute'>
                Your <span className='text-success'>Ongoing</span> Request
            </div>
                <div className='history-wrapper relative'>
                    <div className='history-dropdown'>
                <div className='pl-4'>
                    <Select options={options} defaultValue={'default'} className='w-full' onChange={handleSort}></Select>
                </div>

                    </div>
                </div>
                {cancelTemps?.map((c) => {
                    let formattedRequestDay=dayjs(c.cancelRequest.dayReq)
                        .tz('Asia/Ho_Chi_Minh').format('D/MM/YYYY')
                    // processing => Processing
                    let uppercaseState=c.cancelRequest.isAccept.toUpperCase().charAt(0)+c.cancelRequest.isAccept.toLowerCase().slice(1);
                    // format day and money
                    let formattedRefundAmount=formatMoney(c.cancelRequest.refundAmount)
                    let formattedDayAcp=dayjs(c.cancelRequest.refundDay).tz('Asia/Ho_Chi_Minh').format('D/MM/YYYY')
                    return (
                        <div key={c.cancelRequest._id}>
                            <div className='card-wrapper w-full '>
                                <div className='card-holder'>
                                    <div className='row p-3'>
                                        <div className='col-6'>
                                            {/*left display cancel request*/}
                                            <div className='flex-between'>
                                                <span>Invoice ID:</span>
                                                {c.cancelRequest._id}</div>
                                            <div className='flex-between'>
                                               <span>Day request: </span>
                                                {formattedRequestDay}
                                            </div>
                                            <div className='flex-between'>
                                                <span>Total day (from cancel day to check-in day)</span>
                                                {c.cancelRequest.dayDiffFromCheckIn}
                                            </div>
                                        </div>
                                        <div className='col-6 border-l'>
                                            {/*right display invoice*/}
                                            <div className='row'>
                                            <div className='col-7 text-left'>
                                                <div> Contact Email: {c.invoice.guestInfo.email}</div>
                                                <div> Payment Method: {c.invoice.guestInfo.paymentMethod}</div>
                                                <div> Total Price: {c.invoice.guestInfo.totalPrice}</div>
                                            </div>
                                            <div className='col-5'>
                                                <div className='flex items-end h-full italic flex-col text-right'>
                                                    {uppercaseState==='Accepted'&&(
                                                        <>
                                                        <div>Refund Amount: {formattedRefundAmount} VND</div>
                                                        <div>Accept day: {formattedDayAcp} </div>
                                                        </>
                                                    )}
                                                    {uppercaseState==='Rejected'&&(
                                                        <div>Reason:{c.cancelRequest.rejectedReason}</div>
                                                    )}
                                                    <ChangeStateColor state={uppercaseState}></ChangeStateColor>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

        </>
    )
}
export default YourCancelRequest
