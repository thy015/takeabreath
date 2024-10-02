import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { MdRoom } from "react-icons/md";
import { Link } from "react-router-dom";
import {RateStar} from "./Rate";


// hotel display page
const AccommodationCard = ({ hotel,onClick }) => {
  return (
    <div onClick={onClick}>
    <Card className="mb-4 ">
      <Row noGutters>
        <Col md={4}>
          <Card.Img
            className="object-cover h-[250px] rounded-tl-[12px] rounded-tr-none rounded-br-none p-3"
            src={hotel.imgLink}
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
              <div>Room total: {hotel.numberOfRooms}</div>
            </Card.Text>

            {/* later for approriate room display */}
            <Row>
              <Col md={7}>
                <div className="w-full bg-blue-500 h-28">test</div>
              </Col>
              <Col md={5}>
                <div className="font-semibold flex flex-col">
                  <div className="text-green-600">VND: ....</div>
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
const PropertyCard = ({ property,link_property}) => {
  return (
    // `/hotel/${property._id}`
    <Link to={link_property} className="link-property">
    <Card className="shadow-sm h-full rounded-[12px]">
      <Card.Img className="h-[150px] object-cover rounded-tl-[12px] rounded-tr-[12px] rounded-b-none"
        variant="top"
        src={property.imgLink}
      
      />
      <Card.Body className="h-[210px] flex flex-col flex-grow-1">
        <Card.Title>{property.hotelName}</Card.Title>
        <RateStar hotel={property}></RateStar>
        <Card.Text>{property.address}</Card.Text>
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
        <div className="mt-3" style={{ fontWeight: "bold", fontSize: "16px" }}>
          Start from  ....{property.minPrice} vnd
        </div>
      </Card.Body>
    </Card>
    </Link>
  );
};


export { PropertyCard, AccommodationCard };