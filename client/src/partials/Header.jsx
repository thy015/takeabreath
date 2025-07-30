import {Button, Dropdown, Row, Col} from "antd";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useTranslation} from "react-i18next";
import ChangeLangButton from "@/components/ChangeLangButton";
import styled from 'styled-components'
import {useToastNotifications} from "@/hooks/useToastNotification";
import PropTypes from "prop-types";
import {LogOut, Menu} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {clearAuthData} from "@/store/redux/auth";
import {authApis} from "@/apis/auth/auth";

const Header = ({children}) => {
  const auth = useSelector (state => state.auth);
  const navigate = useNavigate ()
  const toast = useToastNotifications ()
  const {t} = useTranslation ();
  const dispatch = useDispatch ();
  axios.defaults.withCredentials = true
  //log in
  const handleLogInNavigate = (e) => {
    if (auth?.name || "") {
      navigate ('/profile')
    } else {
      e.preventDefault ()
      navigate ('/login', {state: {from: location.pathname}})
    }
  }
  const setLogout = () => {
    if (auth) {
      items.push ({
        label: "Log Out", key: "4", onClick: handleClickMenuItem, icon: (<LogOut size={16}/>),
      })
    }
  }

  const setText = () => {
    if (auth?.name) {
      return auth.name;
    }
    if (auth?.email) {
      return auth.email;
    }
    return t ('sign-in');
  };

  const Logout = async () => {
    try {
      const res=authApis.logOut()
      if (res.logout) {
        toast.showSuccess ("Logout Successful");
        dispatch (clearAuthData ());
        navigate ("/");
      } else {
        toast.showError ("Logout failed");
      }
    } catch (err) {
      console.error ("Error during logout:", err);
      toast.showError ("An error occurred during logout");
    }
  };

  const handleClickMenuItem = (e) => {
    const key = e.key
    switch (key) {
      case "1":
        console.log ("Key 1");
        break;
      case "2":
        console.log ("Key 2");
        break;
      case "3":
        console.log ("Key 3");
        break;
      case "4":
        Logout ();
        break;
      default:
        console.log ("Default");
        break;
    }

  }

  const hoverEffect = " text-center text-white text-[20px] font-afacad transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105 no-underline hover:bg-[#5576B4] hover:rounded-md";

  const items = [{
    label: (<a
      className="no-underline"
      href="/mybooking"
    >
      My Reservation
    </a>), key: "0",
  }, {
    label: (<a
      className="no-underline"
      target="_blank"
      rel="noopener noreferrer"
      href="https://takeabreath.io.vn/registerOwner"
    >
      Register Owner!
    </a>), danger: true, key: "1",
  }, {
    type: "divider", key: "divider-1",
  }, {}];
  setLogout ()
  //handle scroll
  const [scrollProgress, setScrollProgress] = useState (0)
  const handleScroll = () => {
    const scrollTop = window.scrollY
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrollPercent = (scrollTop / windowHeight) * 100
    setScrollProgress (scrollPercent)
  }
  useEffect (() => {
    window.addEventListener ('scroll', handleScroll)

    return () => {
      window.removeEventListener ('scroll', handleScroll)
    }
  }, [])
  return (<div>
    <div className="fixed z-50 w-full">

      <Row justify={"center"} className="bg-[#114098]">
        <Col span={2}></Col>
        <Col span={20}>
          <Link to='/' className="no-underline">
            <div className="text-white text-[25px] font-lobster cursor-pointer float-left py-3 absolute ml-6">
              {" "}
              Take A Breath
            </div>
          </Link>
          <div className="bg-[#114098] flex justify-between pt-12 pb-8">

            <ul className="flex items-end justify-start">
              <Link to="/" className={hoverEffect}>
                <li className='w-28 '>
                  {t ('booking')}
                </li>
              </Link>
              <Link to="/" className={hoverEffect}>
                <li className='w-28'>
                  {t ('activities')}
                </li>
              </Link>
              <Link to="/" className={hoverEffect}>
                <li className='w-24'>
                  {t ('coupons')}
                </li>
              </Link>
              <Link to="/" className={hoverEffect}>
                <li className='w-28'>
                  {t ('favs')}
                </li>
              </Link>

            </ul>

            <div className="items-start">
              <ul className="flex space-x-4 cursor-pointer">
                <li className="flex">
                  <ChangeLangButton color="white" underlineColor="yellow"/>
                </li>
                <li className="w-20">
                  <p className={hoverEffect}> {t ('partners')}</p>
                </li>
                <Link to='/about-us' className='no-underline'>
                  <li className='w-32'>
                    <p className={hoverEffect}> {t ('about-us')}</p>
                  </li>
                </Link>


                <li>

                  <div onClick={handleLogInNavigate}>
                    <Button>{setText ()}</Button>
                  </div>
                </li>
                <li>
                  {auth.isAuthenticated ? <></> : <Link to="/register" className="no-underline">
                    <Button>{t ('register')}</Button>
                  </Link>}

                </li>
                {""}
                <li>

                </li>
                <li>
                  <Dropdown
                    menu={{
                      items, onClick: handleClickMenuItem
                    }}
                    trigger={["click"]}
                    arrow
                    placement="bottomRight"

                  >
                    <Menu
                      size={24}
                      className="mt-1 text-white cursor-pointer"
                    />
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col span={2}></Col>
        {/* //progress bar */}
      </Row>
      <ProgressBar style={{width: `${scrollProgress}%`, marginTop: '-5px'}}></ProgressBar>

    </div>
    <div className="pt-[120px]">
      {children}

    </div>
  </div>);
};
const ProgressBar = styled.div`
    position: fixed;
    left: 0;
    width: 0;
    height: 5px;
    z-index: 50;
    transition: width 0.2s ease-in-out;
    background-color: #15b3b6;
`

Header.propTypes = {
  children: PropTypes.node,
}
export default Header;

