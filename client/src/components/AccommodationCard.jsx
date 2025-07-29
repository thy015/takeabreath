import React, {useEffect, useState} from "react";
import {Card, Button, Row, Col} from "react-bootstrap";
import {MdRoom} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import {RateStar} from "./Rate";
import {useDispatch, useSelector} from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types";
import {setClickedHotel} from "@/store/redux/searchSlice";

// hotel display page
const AccommodationCard = ({hotel, onClick}) => {
  AccommodationCard.propTypes = {
    hotel: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
  }
  const {roomData} = useSelector ((state) => state.searchResults);
  const filteredRoom = roomData?.filter ((r) => r.hotelID === hotel._id)[0];

  const formatMoney = (money) => {
    return new Intl.NumberFormat ("de-DE").format (money);
  };

  return (
    <div onClick={onClick}>
      <Card className="mb-4 card-wrapper">
        <Row noGutters>
          <Col md={4}>
            <img
              className="object-cover h-[250px] w-full rounded-tl-[12px] rounded-tr-none rounded-br-none p-3"
              src={hotel.imgLink[0]}
              alt="HOTEL IMG"
            />
          </Col>
          <Col md={8}>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <Card.Title as="h5" className="font-semibold">
                  {hotel.hotelName} - {hotel.hotelType}
                  <div className="flex mt-2">
                    <RateStar hotel={hotel}></RateStar>
                  </div>
                </Card.Title>
                <div>
                  <span className="text-success font-weight-bold mr-2">
                    {hotel.numberOfRates} people have rated
                  </span>
                  <span
                    className="badge bg-[#0f4098]"
                    style={{fontSize: "16px"}}
                  >
                    {hotel.rate}
                  </span>
                </div>
              </div>

              <Card.Text className="flex gap-5">
                <div className="flex items-center">
                  <MdRoom className="text-red-600"/>
                  <span className="ml-2">
                    {hotel.city} - {hotel.nation}
                  </span>
                </div>
                <div className="text-muted  ">{hotel.address}</div>
                {/* <div>Room total: {hotel.numberOfRooms}</div> */}
              </Card.Text>

              {/* later for approriate room display */}
              <Row>
                <Col md={7}>
                  {filteredRoom ? (
                    <div className="w-full h-28 p-2 flex justify-center flex-col border-l items-start">
                      <h6>{filteredRoom.roomName}</h6>
                      <div>Room Type: {filteredRoom.typeOfRoom}</div>
                      <div>Number of beds: {filteredRoom.numberOfBeds}</div>
                    </div>
                  ) : (
                    <div className="w-full h-28">No available rooms</div>
                  )}
                </Col>
                <Col md={5}>
                  <div className="font-semibold flex flex-col items-end">
                    {filteredRoom ? (
                      <div className="text-green-600 text-lg">
                        From: {formatMoney (filteredRoom.money)} VND
                      </div>
                    ) : null}
                    <div className="text-muted font-[14px]">
                      Included taxes and charges
                    </div>
                    <div className="flex-end">
                      <Button
                        size="sm"
                        className="mt-10 float-end "
                        style={{backgroundColor: "#0f4098"}}
                      >
                        See availability
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// homepage display
const PropertyCard = ({
  property,
  link_button,
  showButton = false,
}) => {
  PropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
    link_button: PropTypes.string.isRequired,
    showButton: PropTypes.bool.isRequired,
  }
  // handle click each hotel
  const dispatch = useDispatch ();
  const navigate = useNavigate ();
  const [roomData, setRoomData] = useState (null);
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  useEffect (() => {
    const fetchRoomData = async () => {
      try {
        const res = await fetch (
          `${BE_PORT}/api/hotelList/hotel/${property._id}/room`
        );
        const data = await res.json ();
        setRoomData (data);
      } catch (e) {
        console.log ("E in property card fe", e);
      }
    };
    fetchRoomData ();
  }, [property._id]);

  const handleClickPropCard = () => {
    dispatch (
      setClickedHotel ({
        clickedHotel: property,
        attachedRooms: roomData,
      })
    );
    navigate (`/hotel/${property._id}`);
  };
  return (
    <div className="link-property w-full h-full" onClick={handleClickPropCard}>
      <Card className="card-wrapper ">
        <Card.Img
          className="h-[150px] object-cover rounded-tl-[12px] rounded-tr-[12px] rounded-b-none"
          variant="top"
          src={property.imgLink[0]}
        />
        <Card.Body className="h-[200px] flex flex-col items-center flex-1">
          <Card.Title>{property.hotelName}</Card.Title>
          <RateStar hotel={property}></RateStar>
          <Card.Text className="text-wrap overflow-hidden text-ellipsis">
            {property.address}
          </Card.Text>
          <div className="flex-center">
            <div className="card-rate">{property.rate}</div>
            <div style={{marginLeft: "8px"}}>
              {property.numberOfRates} people have rated - {property.hotelType}
            </div>
          </div>
          {!showButton && (
            <div
              className="mt-2"
              style={{fontWeight: "bold", fontSize: "16px"}}
            >
              Start from {property.smallestPrice} vnd
            </div>
          )}
          {showButton && (
            <div className="flex justify-center mt-7">
              <Link to={link_button}>
                <button className="bg-green-700 text-white font-bold py-1 px-2 rounded hover:bg-green-400">
                  Phòng
                </button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
//amenities
const AmenitiesCard = ({hotel}) => {
  AmenitiesCard.propTypes = {
    hotel: PropTypes.object.isRequired,
  };

  const amenData = hotel.hotelAmenities;
  const amenKeys = Object.keys (amenData);

  const formatKey = (key) => {
    if (key === "heatingAndCooling") {
      return "Heating & Cooling";
    }
    const words = [];
    let currentWord = key[0].toUpperCase(); // Start with the first letter capitalized

    for (let i = 1; i < key.length; i++) {
      const char = key[i];
      if (char === char.toUpperCase()) {
        // Start a new word when encountering an uppercase letter
        words.push(currentWord);
        currentWord = char;
      } else {
        currentWord += char;
      }
    }
    words.push(currentWord); // Add the last word
    return words.join(" ");
  };
  return (
    <div className="grid grid-cols-4 gap-4">
      {amenKeys.map ((key) => {
        const items = amenData[key];
        if (items.length > 0) {
          return (
            <div key={key} className="flex flex-col gap-2">
              {/* Key as column header */}
              <h5 className="font-afacad">{formatKey(key)}</h5>
              {/* Amenities under the key */}
              {items.map ((amenity, idx) => {
                const encodedItem = encodeURIComponent (amenity);
                const imgSrc = `/icon/${key}/${encodedItem}.png`;

                return (
                  <div key={idx} className="flex items-center gap-2">
                    <img
                      className="w-5"
                      src={imgSrc}
                      alt={`${amenity} icon`}
                      onError={(e) => {
                        e.target.src = `/icon/Avatar%20Cute/kitten.png`;
                      }}
                    />
                    <span>{amenity}</span>
                  </div>
                );
              })}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};
// trang báo
const PressReleasesCarousel = ({cardData}) => {
  PressReleasesCarousel.propTypes = {
    cardData: PropTypes.array.isRequired,
  }
  // setting carousels
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {cardData.map ((c, index) => (
        <div key={index}>
          <Card
            style={{
              width: "280px",
              border: "none",
              textAlign: "left",
              paddingRight: "40px",
            }}
          >
            <Card.Img
              src={c.imgLink}
              alt={c.imgAlt}
              style={{borderRadius: "none"}}
            />
            <Card.Body>
              <Card.Text>{c.dateReleased}</Card.Text>
              <Card.Title>{c.title}</Card.Title>
              <Card.Text>{c.describe}</Card.Text>
              <Button variant="light">READ MORE</Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Slider>
  );
};

const OurAchievementsCard = ({cardData}) => {
  OurAchievementsCard.propTypes = {
    cardData: PropTypes.array.isRequired,
  }
  // setting carousels
  const settings = {
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    prevArrow: (
      <button
        className="slick-prev slick-arrow"
        aria-label="Previous"
        style={{color: "black", fontSize: "20px"}}
      >
        &#10094; {/* Left arrow */}
      </button>
    ),
    nextArrow: (
      <button
        className="slick-next slick-arrow"
        aria-label="Next"
        style={{color: "black", fontSize: "20px"}}
      >
        &#10095; {/* Right arrow */}
      </button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  return (
    <Slider {...settings}>
      {cardData.map ((c, index) => (
        <div key={index}>
          <Card
            style={{
              width: "320px",
              border: "none",
              textAlign: "left",
              padding: "0 20px",
            }}
          >
            <img
              src={c.imgLink}
              alt={c.imgAlt}
              style={{
                borderTopLeftRadius: "20px",
                width: "90%",
                borderBottomLeftRadius: "20px",
                height: "160px",
                objectFit: "cover",
              }}
            />
            <Card.Body>
              <Card.Text>{c.dateReleased}</Card.Text>
              <Card.Title>{c.title}</Card.Title>
              <Button variant="light">READ MORE</Button>
            </Card.Body>
          </Card>
        </div>
      ))}
    </Slider>
  );
};
export {
  PropertyCard,
  AccommodationCard,
  PressReleasesCarousel,
  OurAchievementsCard,
  AmenitiesCard,
};
