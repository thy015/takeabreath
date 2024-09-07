import React from "react";
import { Row, Col } from "antd";
import {
  DiscordFilled,
  FacebookFilled,
  InstagramFilled,
} from "@ant-design/icons";
const Footer = () => {
  return (
    <div>
      <div className="h-[50%] bg-[#003580] mt-4">
        <Row className="pl-8">
          <Col span={2}></Col>
          <Col span={20}>
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
              <div className="me-5 d-none d-lg-block text-white text-[16px]">
                <span>Get connected with us on social networks:</span>
              </div>

              <div className="cursor-pointer">
                <FacebookFilled className="text-[#fff] text-[24px] me-4" />
                <InstagramFilled className="text-[#fff] text-[24px] me-4"></InstagramFilled>
                <DiscordFilled className="text-[#fff] text-[24px] me-4" />
              </div>
            </section>
            <section>
              <div className="mt-4 text-white ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
                  {/* Company Info */}
                  <div className="items-center justify-center text-center flex flex-col">
                    <h3 className="text-lg mb-3 font-lobster ">
                      TAKE A BREATH
                    </h3>
                    <p className="text-white">
                      Here you can use rows and columns to organize your footer
                      content. Lorem ipsum dolor sit amet, consectetur
                      adipisicing elit.
                    </p>
                  </div>

                  {/* Products */}
                  <div className="items-center self-start flex flex-col">
                    <h3 className="text-lg font-semibold mb-3">PRODUCTS</h3>
                    <ul className="pl-0">
                      <li>Angular</li>
                      <li>React</li>
                      <li>Vue</li>
                      <li>Laravel</li>
                    </ul>
                  </div>

                  {/* Useful Links */}
                  <div className="items-center justify-center text-center flex flex-col">
                    <h3 className="text-lg font-semibold mb-3">USEFUL LINKS</h3>
                    <ul className="pl-0">
                      <li>Pricing</li>
                      <li>Settings</li>
                      <li>Orders</li>
                      <li>Help</li>
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="items-center justify-center text-center flex flex-col">
                    <h3 className="text-lg font-semibold mb-3">CONTACT</h3>
                    <ul className="pl-0">
                      <li>
                        <span className="mr-2">🏠</span> New York, NY 10012, US
                      </li>
                      <li>
                        <span className="mr-2">✉️</span> info@example.com
                      </li>
                      <li>
                        <span className="mr-2">📞</span> +01 234 567 88
                      </li>
                      <li>
                        <span className="mr-2">📠</span> +01 234 567 89
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
              <div className="me-5 d-none d-lg-block text-white text-[16px]"></div>
            </section>
          </Col>
          <Col span={2}></Col>
        </Row>
      </div>
    </div>
  );
};

export default Footer;
