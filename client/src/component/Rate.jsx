import React from "react";
import { Rate } from "antd";
// need enhance
const rateCal = (rate) => {
  if (rate >= 4.8) {
    return 5;
  } else if (rate >= 4.0) {
    return 4;
  } else if (rate > 3.5) {
    return 3;
  } else if (rate > 2.5) {
    return 2;
  } else return 0;
};
const getRatingDescription = (rate) => {
  if (rate >= 4.8) {
    return "Excellent";
  } else if (rate >= 4.0) {
    return "Very Good";
  } else if (rate > 3.5) {
    return "Good";
  } else if (rate > 2.5) {
    return "Average";
  } else {
    return "Unknown";
  }
};

const RateStar = ({ hotel }) => {
  return (
    <div>
      {/* on Cards */}
      <Rate disabled defaultValue={rateCal(hotel.rate)}></Rate>
    </div>
  );
};
const RateText = ({ hotel }) => {
  return (
    <div className='text-muted text-[16px] justify-center flex'>
        {getRatingDescription(hotel.rate)}
      </div>
  );
};

export { RateStar,RateText };