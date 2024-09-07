import { Button, Dropdown, Row, Col } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars } from "@fortawesome/free-solid-svg-icons";
import ".././index.css";

const Header = ({ children }) => {
  const hoverEffect =
    "text-white text-[18px] pl-5 font-bold transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105";

  const items = [
    {
      label: (
        <a
          className="no-underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          My Reservation
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          className="no-underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          Register Owner!
        </a>
      ),
      danger: true,
      key: "1",
    },
    {
      type: "divider",
      key: "divider-1",
    },
    {
      label: "   Tiếng Việt",
      key: "2",
      icon: (
        <img
          src="/img/vietFlag.png"
          alt="Vietnam Flag"
          style={{ width: "16px", marginRight: "8px" }}
        />
      ),
    },
    {
      label: "English",
      key: "3",
      icon: (
        <img
          src="/img/united-states.png"
          alt="USA Flag"
          style={{ width: "16px", marginRight: "8px" }}
        />
      ),
    },
  ];
  return (
    <div>
      <Row justify={"center"} className="bg-[#114098]">
        <Col span={2}></Col>
        <Col span={20}>
          <div class="bg-[#114098] flex justify-between items-center pt-4 pb-1 relative">
            <ul class="flex pt-7 mt-3 ">
              <div className="absolute top-2 text-white left-[3%] text-[25px] font-lobster cursor-pointer pt-2">
                {" "}
                Take A Breath
              </div>
              <li>
                <Link to="/" className="no-underline ">
                  <p className="text-white text-[18px] font-bold transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105">
                    Booking
                  </p>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>Activities</p>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>Coupons and Discount</p>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>Membership</p>
                </Link>
              </li>
            </ul>
            <ul class="flex space-x-5 pt-3">
              <li>
                <Link to="/" className="no-underline">
                  <Button>Log In</Button>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <Button>Sign Up</Button>
                </Link>
              </li>{" "}
              <li>
                <Link to="/" className="no-underline">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    size="lg"
                    className="mt-2 text-white"
                  />
                </Link>
              </li>
              <li>
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                  arrow
                  placement="bottomRight"
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    size="xl"
                    className="mt-1 text-white cursor-pointer"
                  />
                </Dropdown>
              </li>
            </ul>
          </div>
        </Col>
        <Col span={2}></Col>
      </Row>

      {children}
    </div>
  );
};

export default Header;
