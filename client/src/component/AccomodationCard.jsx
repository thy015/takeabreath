import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { MdRoom } from "react-icons/md";
import { Link } from "react-router-dom";
import { RateStar } from "./Rate";
import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// hotel display page
const AccommodationCard = ({ hotel, onClick }) => {
  const { roomData } = useSelector((state) => state.searchResults)
  const filteredRoom = roomData?.filter(r => r.hotelID === hotel._id)[0]

  const formatMoney = (money) => {
    return new Intl.NumberFormat('de-DE').format(money)
  }

  return (
    <div onClick={onClick}>
    <Card className="mb-4 ">
      <Row noGutters>
        <Col md={4}>
          <Card.Img
            className="object-cover h-[250px] rounded-tl-[12px] rounded-tr-none rounded-br-none p-3"
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
                <span className="badge bg-[#0f4098]" style={{ fontSize: "16px" }}>
                  {hotel.rate}
                </span>
              </div>
            </div>

            <Card.Text className="flex gap-5">
              <div className="flex items-center">
                <MdRoom className="text-red-600" />
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
                    <div className="w-full h-28 p-2 flex justify-start flex-col items-start">
                      <h6>{filteredRoom.roomName}</h6>
                      <div>Room Type: {filteredRoom.typeOfRoom}</div>
                      <div>Number of beds: {filteredRoom.numberOfBeds}</div>
                      <div className="text-success">Price: {formatMoney(filteredRoom.money)} VND</div>
                    </div>
                  ) : (
                    <div className="w-full h-28">No available rooms</div>
                  )}
                </Col>
              <Col md={5}>
                <div className="font-semibold flex flex-col items-end">
                {filteredRoom ? (
                  <div className="text-green-600">From: {formatMoney(filteredRoom.money)} VND</div>)
                  :null
                  }
                  <div className="text-muted font-[14px]">
                    Included taxes and charges
                  </div>
                  <div className="flex-end">
                    <Button size="sm" className="mt-10 float-end "style={{ backgroundColor: '#0f4098'}}>
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
const PropertyCard = ({ property, link_button, showButton = false, edit, showDeleteModal }) => {
  return (
    <Link to={`/hotel/${property._id}`} className="link-property">
    <Card className="shadow-sm h-full rounded-[12px]">
      <Card.Img
        className="h-[150px] object-cover rounded-tl-[12px] rounded-tr-[12px] rounded-b-none"
        variant="top"
        src={property.imgLink}
      />
      <Card.Body className="h-[210px] flex flex-col flex-grow-1">
        <Card.Title>{property.hotelName}</Card.Title>
        <RateStar hotel={property}></RateStar>
        <Card.Text className="whitespace-nowrap overflow-hidden text-ellipsis">{property.address}</Card.Text>
        <div className="d-flex align-items-center">
          <div
            style={{
              backgroundColor: "#003580",
              color: "white",
              padding: "0 8px",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            {property.rate}
          </div>
          <div style={{ marginLeft: "8px" }}>
            {property.numberOfRates} people have rated - {property.hotelType}
          </div>
      
        </div>
        <div className="mt-2" style={{ fontWeight: "bold", fontSize: "16px" }}>
            Start from ....{property.minPrice} vnd
          </div>
        {showButton && (
          <div className="flex justify-end">
            
            <Link to={link_button}>
              <button className="bg-green-700 text-white font-bold py-1 px-2 rounded hover:bg-green-400">
                Phòng
              </button>
            </Link>

          </div>
        )}
      </Card.Body>
    </Card>
    </Link>
  );
};

const PressReleasesCarousel=({cardData})=>{
  // setting carousels
  const settings={
    dots: true,
    arrows:false,
    infinite: true,
    speed: 500,
    slidesToShow:3,
    slidesToScroll:3,
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
  }
  return(
  <Slider {...settings}>
  {cardData.map((c,index)=>(
    <div key={index}>
      <Card style={{ width: '280px',border:'none', textAlign:'left', paddingRight:'40px'}}>
    <Card.Img src={c.imgLink} alt={c.imgAlt} style={{borderRadius:'none'}}/>
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
  )
}

const OurAchievementsCard=({cardData})=>{
  // setting carousels
  const settings={
    arrows:true,
    infinite: true,
    speed: 500,
    slidesToShow:4,
    slidesToScroll:1,
    prevArrow: (
      <button className="slick-prev slick-arrow" aria-label="Previous" style={{ color: 'black', fontSize: '20px' }}>
        &#10094; {/* Mũi tên trái */}
      </button>
    ),
    nextArrow: (
      <button className="slick-next slick-arrow" aria-label="Next" style={{ color: 'black', fontSize: '20px' }}>
        &#10095; {/* Mũi tên phải */}
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
  }
  return(
  <Slider {...settings}>
  {cardData.map((c,index)=>(
    <div key={index}>
      <Card style={{ width: '320px',border:'none', textAlign:'left', padding:'0 20px'}}>
    <img src={c.imgLink} alt={c.imgAlt} style={{borderTopLeftRadius:'20px',width:'90%',borderBottomLeftRadius:'20px',height:'160px',objectFit:'cover'}}/>
    <Card.Body>
      <Card.Text>{c.dateReleased}</Card.Text>
      <Card.Title>{c.title}</Card.Title>
      <Button variant="light">READ MORE</Button>
    </Card.Body>
    </Card>
    </div>
  ))}
  </Slider>
  )
}
export { PropertyCard, AccommodationCard,PressReleasesCarousel,OurAchievementsCard };
