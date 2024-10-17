import { Button, Dropdown, Row, Col } from "antd";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ".././index.css";
import { AuthContext } from "../hooks/auth.context";
import axios from "axios";
import { openNotification } from "../hooks/notification";
import { useTranslation, Trans } from "react-i18next";

const Header = ({ children }) => {
  //translate
  const { t ,i18n} = useTranslation();
  const changeLanguage=(lng)=>{
    i18n.changeLanguage(lng)
  }
  const { auth, setAuth } = useContext(AuthContext)
  axios.defaults.withCredentials = true
    //log in
    const navigate=useNavigate()
    const handleLogInNavigate=(e)=>{
      if(auth.isAuthenticated){
        navigate('/profile')
      }else{
        e.preventDefault()
        navigate('/login', {state:{from:location.pathname}})
      }
    }
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
      return t('sign-in')
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
    "text-white text-[18px] pl-5 font-bold transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105 ";

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
        <Link to='/' className="no-underline">
              <div className="text-white text-[25px] font-lobster cursor-pointer float-left py-3 absolute">
                {" "}
                Take A Breath
              </div>
              </Link>
          <div className="bg-[#114098] flex justify-between pt-12 pb-3">
           
            <ul className="flex pt-4 items-end">
              <li>
                  <p className="text-white text-[18px] font-bold transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105">
                    {t('booking')}
                  </p>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>{t('activities')}</p>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>{t('coupons')}</p>
                </Link>
              </li>
              <li>
                <Link to="/" className="no-underline">
                  <p className={hoverEffect}>{t('favs')}</p>
                </Link>
              </li>
           
            </ul>
          
            <div className="items-start">
            <ul class="flex space-x-4 cursor-pointer">
             
            <li className="flex ">

            <div className={
                  i18n.language === 'vie' ? 'font-bold underline decoration-yellow-200' : ''
                }
                onClick={()=>changeLanguage('vie')}>
            <p className={hoverEffect}> {t('VIE')}</p>
              </div>
              <div
                className={i18n.language === 'en' ? 'font-bold underline decoration-yellow-200' : ''}
                onClick={() => changeLanguage('en')}
              >
                <p className={hoverEffect}>{t('EN')}</p>
              </div>
             </li>
            <li>
           <p className={hoverEffect}> {t('partners')}</p>
             </li>
            <li>
              <p className={hoverEffect}> {t('about-us')}</p>
             </li>
            <li className="pr-3">
            <p className={hoverEffect}> {t('my-reserve')}</p>
             </li>
            

              <li>        

                <div onClick={handleLogInNavigate}>
                  <Button>{setText()}</Button>
                  </div>
              </li>
              <li>
                {
                  auth.isAuthenticated ? <></>:<Link to="/register" className="no-underline">
                  <Button>{t('register')}</Button>
                </Link>
                }
                
              </li>{""}
              <li>
             
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
          </div>
        </Col>
        <Col span={2}></Col>
      </Row>

      {children}
    </div>
  );
};

export default Header;