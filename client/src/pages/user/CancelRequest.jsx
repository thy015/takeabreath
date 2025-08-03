import React, {useEffect} from 'react'
import {Alert, Select, Spin} from "antd";
import {useDispatch, useSelector} from 'react-redux';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {filterSort, setCancel} from "@/store/redux/cancelSlice";
import PropTypes from "prop-types";
import {useGet} from "@/hooks/hooks";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {BadgeInfo} from "lucide-react";
// TODO: Change from accept base on admin to auto
// TODO: Add card for user
// cancel req state
const ChangeStateColor = ({state}) => {
  ChangeStateColor.propTypes = {
    state: PropTypes.string.isRequired
  }
  let styleColor = {
    color: state === 'Processing' ? '#d59e00'
      : state === 'Accepted' ? 'green'
        : state === 'Rejected' ? 'red'
          : 'black'
  }
  return (
    <div style={styleColor}>
      {state}
    </div>
  )
}
const CancelRequest = () => {
  const auth = useSelector (state => state.auth)
  const BE_PORT = import.meta.env.VITE_BE_PORT
  const userId = auth?.id
  const cancelTemps = useSelector (state => state.cancel.cancelTemps)
  const cancel = useSelector (state => state.cancel.cancel)

  const dispatch = useDispatch ()
  dayjs.extend (utc);
  dayjs.extend (timezone);
  if (!userId) {
    return <Alert message="Please try sign in first" type="info" showIcon/>;
  }
  const {data, error, loading} = useGet (`${BE_PORT}/api/cancelReq/${userId}/cancelRequest`);
  useEffect (() => {
    dispatch (setCancel (data.data))
  }, [data])

  const handleSort = (value) => {
    const valueSet = {
      value,
      cancel
    }
    dispatch (filterSort (valueSet))
  }

  const options = [
    {
      label: "Default",
      value: "default"
    },
    {
      label: "Accepted",
      value: "accepted"
    },
    {
      label: "Failed",
      value: "rejected"
    },
    {
      label: "Processing",
      value: "processing"
    },
  ]

  if (loading) {
    return <Spin size="large" style={{display: "block", margin: "auto"}}/>;
  }

  if (error || data.length === 0 || !data) {
    return <Alert message="Notice" description="You haven't make any cancel request." type="info" showIcon/>;
  }
  const formatMoney = (money) => {
    return new Intl.NumberFormat ('de-DE').format (money)
  }
  console.log (cancelTemps)
  return (
    <>
      <div className='w-full text-start font-afacad text-2xl absolute flex items-center space-x-2'>
        <div>Your <span className='text-success'>Ongoing</span> Request</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <BadgeInfo className='text-yellow-500' size={24}></BadgeInfo>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='history-wrapper relative'>
        <div className='history-dropdown'>
          <div className='pl-4'>
            <Select options={options} defaultValue={'default'} className='w-full' onChange={handleSort}></Select>
          </div>

        </div>
      </div>
      {cancelTemps?.map ((c) => {
        let formattedRequestDay = dayjs (c.cancelRequest.dayReq).tz ('Asia/Ho_Chi_Minh').format ('D/MM/YYYY')
        // processing => Processing
        let uppercaseState = c.cancelRequest.cancelState.toUpperCase ().charAt (0) + c.cancelRequest.cancelState.toLowerCase ().slice (1);
        // format day and money
        let formattedRefundAmount = formatMoney (c.cancelRequest.refundAmount)
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
                        <div> Paid: {formatMoney (c.invoice.guestInfo.totalPrice)} vnd</div>
                      </div>
                      <div className='col-5'>
                        <div className='flex items-end h-full italic flex-col text-right'>
                          <div>Refund Amount: <span
                            className='text-green-500 font-bold'> {formattedRefundAmount} VND </span></div>
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
export default CancelRequest
