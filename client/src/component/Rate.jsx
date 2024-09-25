import React from 'react'
import { Rate } from 'antd'
const RateCompo = ({hotel}) => {
  
  const rateCal = (rate)=>{
        if(rate >=4.8){
          return 5
        }else if(rate>=4.0){
          return 4
        }else if(rate>3.5){
          return 3
        }else if(rate>2.5){
          return 2
        }else return 1
  }
  return (
    <div>
      {/* on Cards */}
      <Rate disabled defaultValue={rateCal(hotel.rate)}></Rate>
    </div>
  )
}

export default RateCompo
