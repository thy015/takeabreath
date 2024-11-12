import React from "react";
import Booking from "../../component/Booking";
import { Row, Col, Carousel } from "antd";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import {cardData} from '../../localData/localData'
import "../../index.scss";
import PropertyGrid from "./Home_HotelDisplay";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const HomePage = () => {
  const { t } = useTranslation();
  const navigate=useNavigate()
  const h4Design = "items-start flex font-bold pb-4";
  const cardItems=cardData()

  // Carousel n Cards
  const slides = [];
  const itemsPerSlide = 4;

  for (let i = 0; i < cardItems.length; i += itemsPerSlide) {
    slides.push(cardItems.slice(i, i + itemsPerSlide));
  }


  return (
    <div>
      <div className="relative">
        <img
          src="https://q-xx.bstatic.com/xdata/images/xphoto/2880x868/363658458.jpeg?k=427a5cc2522eb3d80a76d232939725ec6cf76e03ef26ee846375709b3e9caf6f&o="
          alt="Cozy people sitting"
          className="h-96 object-cover w-full relative"
        />
      </div>
      <div
        className="flex top-[30%] left-[15%] absolute 
      flex-col text-white "
      >
        <div className="font-lobster text-4xl">{t('find-next-stay')}</div>
        <div className="text-lg mt-4">
        {t('search-deals')}
        </div>
      </div>
      <div className="absolute flex left-[25%] mt-[-35px] w-[55%]">
        <Booking tailwind_prop="w-full h-20 flex"></Booking>
      </div>
      <div className="mt-24">
        <Row className="pl-8">
          <Col span={2}></Col>

          <Col span={20}>
            <div className="h-[800px]">
              <h4 className={h4Design}>{t('type-of-accomodation')}</h4>
              {/* Carousel with card groups */}
              <div className="h-72">
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
              </div>
              {/* display homestay */}
              <h4 className={h4Design}>{t('high-rated-accomodation')}</h4>
              <div className="h-[400px]">
                <PropertyGrid></PropertyGrid>
              </div>
            </div>
          </Col>
          <Col span={2}></Col>
        </Row>
        {/* shortage vid */}
        <div
          className="row g-0"
          style={{ marginTop: "50px", marginBottom: "80px" }}
        >
          <div className="col"></div>
          <div className="col-10">
            <div className="row ">
              <div className="col-6" >
                <div className="ml-8">
                  <video height="200" autoPlay muted loop>
                    <source src="/video/shortage-intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>{" "}
                </div>
              </div>
              <div className="col-6" style={{marginTop:'60px'}}>
                <div className="row">
                <h3 className="gryphen font-bold text-[#114098] italic">
                {t('join-us-for-a-remarkable-summer')}
                  </h3>
                  <div className="col-2"></div>
                  <div className="col-8">
                  <p className="text-gray-600 mb-4 text-start">
                  {t('join-us-describe')}
                  </p>
                  <button className="btn btn-primary hover:scale-110" style={{background:'#114098'}} onClick={()=>{
                    navigate('/booking')
                  }}>Learn More</button>
                  </div>
                  <div className="col-2"></div>
                </div>
                <div>
                </div>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </div>{" "}
    </div>
  );
};

export default HomePage;
