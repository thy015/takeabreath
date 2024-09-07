import React from "react";
import Booking from "./Booking";
import { Row, Col, Carousel } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import { cardData } from "../../localData/localData";
import "../../index.css";
import PropertyGrid from "./HotelDisplay";
const HomePage = () => {
  const h4Design = "items-start flex font-bold pb-4";
  // Carousel n Cards
  const slides = [];
  const itemsPerSlide = 4;

  for (let i = 0; i < cardData.length; i += itemsPerSlide) {
    slides.push(cardData.slice(i, i + itemsPerSlide));
  }

  return (
    <div>
      <div>
        <img
          src="https://q-xx.bstatic.com/xdata/images/xphoto/2880x868/363658458.jpeg?k=427a5cc2522eb3d80a76d232939725ec6cf76e03ef26ee846375709b3e9caf6f&o="
          alt="Cozy people sitting"
          className="h-96 object-cover w-full relative"
        />
      </div>
      <div className="flex top-[30%] left-[15%] absolute 
      flex-col text-white ">
        <div className="font-lobster text-4xl">Find your next stay</div>
        <div className="text-lg mt-4">
          Search deals on hotels, homes, and much more...
        </div>
      </div>
      <div>
        <Booking></Booking>
      </div>
      <div className="mt-24">
        <Row className="pl-8">
          <Col span={2}></Col>
          <Col span={20}>
            <h4 className={h4Design}>Search by type of accomodation</h4>
            {/* Carousel with card groups */}
            <Carousel arrows swipeToSlide>
              {slides.map((slide, index) => (
                <div key={index}>
                  <Row justify="space-around" gutter={[16, 16]}>
                    {slide.map((c, index) => (
                      <Col key={index} xs={24} sm={12} md={6}>
                        <Card className="w-[100%] h-[200px] flex flex-col items-center card-no-border ">
                          <Card.Img
                            variant="top"
                            src={c.imgSrc}
                            className="rounded-lg h-[150px] object-cover"
                          />
                          <Card.Body>
                            <Card.Title>{c.title}</Card.Title>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </Carousel>
            {/* display homestay */}
            <h4 className={h4Design}>High rated accomodation</h4>
            <PropertyGrid></PropertyGrid>
          </Col>
          <Col span={2}></Col>
        </Row>
      </div>{" "}
    </div>
  );
};

export default HomePage;
