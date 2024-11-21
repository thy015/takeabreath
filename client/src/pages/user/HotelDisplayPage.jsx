import React, {useEffect, useState} from "react";
import Booking from "../../component/Booking";
import { Row, Col, Checkbox, Collapse, Spin, Alert } from "antd";
import { AccommodationCard } from "../../component/AccommodationCard";
import { useGet } from "../../hooks/hooks";
import { cardData } from "../../localData/localData";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import {GoogleMap,Marker,useJsApiLoader} from "@react-google-maps/api";
import {setOrdinate} from "../../hooks/redux/inputDaySlice";
import {setClickedHotel} from "../../hooks/redux/searchSlice";

const { Panel } = Collapse;
  
const HotelDisplayCompre = () => {

  const google_api_key=import.meta.env.VITE_API_KEY;
  const dispatch=useDispatch()
  const cardItems=cardData()
  const filters = cardItems.map((c) => c.title);
  const BE_PORT=import.meta.env.VITE_BE_PORT
  // global, take from redux and booking
  const searchResults = useSelector((state) => state.searchResults);
  const { city, latitude, longitude} = useSelector((state) => state.inputDay);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: google_api_key,
  });


  useEffect(() => {
    console.log(city, latitude, longitude);
    // mở dòng này ra khi deploy để tránh block API
    searchMapLocation()
  }, [city, latitude,longitude]);
  const navigate = useNavigate();

  const { data, error, loading } = useGet(
    `${BE_PORT}/api/hotelList/hotel`
  );

  const [selectedFilters, setSelectedFilters] = useState([]);
  const handleFilterChange = (checkedValues) => {
    setSelectedFilters(checkedValues);
  };
  if (!isLoaded) return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
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

  if (!searchResults && (!data || data.length === 0) ) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }
  console.log(data);
  // passing prop roomData (receive array from be=> filter to each hotel)
  const handleHotelClick = async (hotel) => {
    let roomData = []
    dispatch(setClickedHotel({
      clickedHotel:hotel
    }))
    // có search result thì hiện, còn ko display toàn bộ phòng
    if (searchResults?.roomData.length > 0) {
      roomData = searchResults.roomData.filter((r) => r.hotelID === hotel._id);
    }
    else {
      const response = await axios.get(
        `${BE_PORT}/api/hotelList/hotel/${hotel._id}/room`
      );
      roomData = response.data;
      console.log('Debug roomdata in hoteldisplaypage',roomData)
    }

    navigate(`hotel/${hotel._id}`, { state: { roomData } });
  };

  // no searchResults => fall back to data
  const displayHotel = searchResults?.hotelData?.length
    ? searchResults.hotelData
    : data;

  // Filter hotels based on selected filters
  const filteredHotels =
    selectedFilters.length > 0
      ? displayHotel.filter((hotel) =>
          selectedFilters.includes(hotel.hotelType)
        )
      : displayHotel;
  //map default ordinate
  async function searchMapLocation() {
    try {
      await axios.post(`${BE_PORT}/api/hotelList/google/geometry`, {city})
          .then(res => {
            console.log(res.data);
            dispatch(setOrdinate({
              latitude:res.data.lat,
              longitude:res.data.lng
            }))
          });
    } catch (e) {
      console.error("Error fetching location:", e);
    }
  }

  const mapCenter = latitude && longitude ? { lat: latitude, lng: longitude } : { lat: 0, lng: 0 };

  return (
    <div>
      <Row>
        <Col span={2} />
        <Col span={20} className="w-full">
          <div className="h-32">
            <div className="absolute flex mt-8 w-full">
              <Booking tailwind_prop="flex w-full h-16" />
            </div>
          </div>
          <div className="flex justify-start font-afacad">
              {searchResults.hotelData?.length > 0 ? (
                <h4 className="text-[30px] text-[#114098] ">
                  {city}: {searchResults.hotelData.length} properties found
                </h4>
              ) : (
                <h4 className="text-[30px] text-[#114098] ">Try searching for what you like:</h4>
              )}
            </div>
          <Row gutter={16} className="mt-6">
            <Col span={5}>
              <Breadcrumb></Breadcrumb>
              {/*gg map display*/}
              <div className="w-full h-[169px] mb-4">

                 <GoogleMap
                     mapContainerStyle={{width: '100%', height: '100%'}}
                     center={mapCenter}
                     zoom={10}
                 >
                   <Marker position={mapCenter}></Marker>
                 </GoogleMap>

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
                {!filteredHotels  ? (
                  <Alert message="No hotels match the criteria." type="info" />
                ) : (
                  filteredHotels.map((hotel, index) => (
                    <AccommodationCard
                      key={index}
                      hotel={hotel}
                      onClick={() => handleHotelClick(hotel)}
                    />
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
