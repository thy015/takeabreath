import { Button, Dropdown, Row, Col } from "antd";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ".././index.css";
import { AuthContext } from "../hooks/auth.context";
import axios from "axios";
import { openNotification } from "../hooks/notification";

const Header = ({ children }) => {

  const { auth, setAuth } = useContext(AuthContext)
  axios.defaults.withCredentials = true

  const setLogout = ()=>{
    if(auth.isAuthenticated){
      items.push({
        label: "Log Out",
        key: "4",
        onClick: handleClickMenuItem,
        icon: (
          <FontAwesomeIcon icon={faArrowLeft} />
        ),
      })
    }
  }

  const setText =()=>{
    if(auth.isAuthenticated){
      if(auth.user.name === '' || !auth.user.name){
        return auth?.user?.email 
      }else{
        return auth?.user?.name 
        
      }
    
    }else{
      return "Log In"
    }
  }

  console.log(setText())
  const Logout = () => {
    axios.get("http://localhost:4000/api/auth/logout")
      .then(res => {
        if (res.data.logout) {
          openNotification(true,"Logout Successful !")
          setAuth({
            isAuthenticated: false,
            user: {
              id: "",
              email: '',
              name: '',
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
  }

  const handleClickMenuItem = (e) => {
    const key = e.key
    switch (key) {
      case "1":
        console.log("Key 1");
        break;
      case "2":
        console.log("Key 2");
        break;
      case "3":
        console.log("Key 3");
        break;
      case "4":
        Logout();
        break;
      default:
        console.log("Default");
        break;
    }

  }

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
          href="http://localhost:3000/registerOwner"
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
    }
  ];


  setLogout()
  return (
    <div>
      <Row justify={"center"} className="bg-[#114098]">
        <Col span={2}></Col>
        <Col span={20}>
          <div class="bg-[#114098] flex justify-between items-center pt-12 pb-4 relative">
            <ul class="flex pt-7 mt-3 ">
              <Link to='/' className="no-underline">
              <div className="absolute top-2 text-white left-[3%] text-[25px] font-lobster cursor-pointer pt-2">
                {" "}
                Take A Breath
              </div>
              </Link>
              <li>
                <Link to="/booking" className="no-underline ">
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
            <ul class="flex space-x-5 ">
              <li>
                <Link to="/login" className="no-underline">
                  <Button>{setText()}</Button>
                </Link>
              </li>
              <li>
                <Link to="/register" className="no-underline">
                  <Button>Sign Up</Button>
                </Link>
              </li>{""}
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
                    onClick: handleClickMenuItem
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