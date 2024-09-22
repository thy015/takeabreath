import { Rate } from "antd";
import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { MdRoom } from "react-icons/md";
// hotel display page
const AccommodationCard = ({ hotel }) => {
  return (
    <Card className="mb-4 rounded-[10px]">
      <Row noGutters>
        <Col md={4}>
          <Card.Img
            className="object-cover h-full rounded-xl "
            src={hotel.imgLink}
            alt="HOTEL IMG"
          />
        </Col>
        <Col md={8}>
          <Card.Body>
            <div className="d-flex justify-content-between">
              <Card.Title as="h5" className="font-semibold">
                {hotel.hotelName} - {hotel.hotelType}
                {/* need to handle this **convert 5=> 5start, 3.5=> 3star... */}
                <div className="flex mt-2">
                  <Rate></Rate>
                </div>
              </Card.Title>
              <div>
                <span className="text-success font-weight-bold mr-2">
                  {hotel.numberOfRates} people have rated
                </span>
                <span className="badge bg-primary" style={{ fontSize: "16px" }}>
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
                    <Button variant="primary" size="sm" className="mt-10 float-end">
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
  );
};
// homepage display
const PropertyCard = ({ property }) => {
  return (
    <Card className="shadow-sm h-full" style={{ borderRadius: "12px" }}>
      <Card.Img
        variant="top"
        src={property.imgLink}
        style={{
          borderRadius: "12px 12px 0 0",
          height: "150px",
          objectFit: "cover",
        }}
      />
      <Card.Body className="h-[210px] flex flex-col flex-grow-1">
        <Card.Title>{property.hotelName}</Card.Title>
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
          Start from {property.minPrice} vnd
        </div>
      </Card.Body>
    </Card>
  );
};

export { PropertyCard, AccommodationCard };
