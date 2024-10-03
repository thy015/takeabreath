import React, { useState } from "react";
import Booking from "../../component/Booking";
import { Row, Col, Checkbox, Collapse, Spin, Alert } from "antd";
import { AccommodationCard } from "../../component/AccomodationCard";
import { useGet } from "../../hooks/hooks";
import { cardData } from "../../localData/localData";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
const { Panel } = Collapse;

const filters = cardData.map((c) => c.title);
const HotelDisplayCompre = () => {
  // global, take from redux and booking
  const searchResults=useSelector((state)=>state.searchResults)
  
  const navigate=useNavigate()
  const { data, error, loading } = useGet(
    "http://localhost:4000/api/hotelList/hotel"
  );

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
  };

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load properties."
        type="error"
        showIcon
      />
    );
  }

  if (!searchResults && (!data || data.length === 0)) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }
  console.log(data);
  // passing prop roomData (receive array from be=> filter to each hotel)
  const handleHotelClick=async(hotel)=>{
    let roomData=[]
    if(searchResults?.roomData.length>0){
      roomData=searchResults.roomData.filter(r=>r.hotelID===hotel._id)
    }else{
      const response = await axios.get(`http://localhost:4000/api/hotelList/hotel/${hotel._id}/room`);
      roomData = response.data; 
    }
    navigate(`hotel/${hotel._id}`,
      { state: { roomData } });
  }
// no searchResults => fall back to data
  const displayHotel  = searchResults?.hotelData?.length
   ? searchResults.hotelData
   : data
  
  // Filter hotels based on selected filters
  const filteredHotels =
  selectedFilters.length > 0
      ? displayHotel.filter((hotel) => selectedFilters.includes(hotel.hotelType))
      : displayHotel;
  

  return (
    <div>
      <Row>
        <Col span={2} />
        <Col span={20} className="w-full">
          <div className="h-32">
            <div className="absolute flex mt-8 w-full">
              <Booking tailwind_prop="flex w-full h-16"/>
            </div>
          </div>
          <Row gutter={16} className="mt-8">
            <Col span={5}>
            <Breadcrumb>
            </Breadcrumb>
            <div className="w-[228px] h-[169px mb-4">
                <img src="https://th.bing.com/th/id/OIP.Xl33AAWnwUNysT_nFRsUEgHaHa?rs=1&pid=ImgDetMain"/> 
            </div>
              <Collapse defaultActiveKey={["1"]}>
                <Panel header="Chọn lọc theo:" key="1">
                  <Checkbox.Group onChange={handleFilterChange}>
                    {filters.map((filter, index) => (
                      <Checkbox key={index} value={filter}>
                        {filter}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </Panel>
              </Collapse>
            </Col>
            {/* hotel display */}
            <Col span={19}>
              <div className="pt-3">
              {!filteredHotels ? (
                  <Alert message="No hotels match the criteria." type="info" />
                ) : (
                  filteredHotels.map((hotel, index) => (
                    <AccommodationCard key={index} hotel={hotel} onClick={() => handleHotelClick(hotel)}/>  
                  )) 
                )}
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={2} />
      </Row>
    </div>
  );
};

export default HotelDisplayCompre;