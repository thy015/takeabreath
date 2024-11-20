import { Button, Dropdown, Row, Col } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../index.scss";
import { AuthContext } from "../hooks/auth.context";
import axios from "axios";
import { openNotification } from "../hooks/notification";
import { useTranslation } from "react-i18next";
import ChangeLangButton from "../component/ChangeLangButton";
import styled from 'styled-components'

const Header = ({ children }) => {

  const { t } = useTranslation();
  const BE_PORT=import.meta.env.VITE_BE_PORT
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

  const Logout = () => {
    axios.get(`${BE_PORT}/api/auth/logout`)
      .then(res => {
        if (res.data.logout) {
          console.log(res.data)
          openNotification(true,"Logout Successful !")
          setAuth({
            isAuthenticated: false,
            user: {
              id: "",
              email: '',
              name: '',
              role:''
            }
          })
          navigate('/')
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
    "text-white text-[20px] font-afacad transition-colors duration-300 hover:text-[#c3eaff] hover:scale-105 no-underline hover:bg-[#5576B4] hover:rounded-md";

  const items = [
    {
      label: (
        <a
          className="no-underline"
          href="/mybooking"
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
          href="https://takeabreath.io.vn/registerOwner"
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
  //handle scroll 
  const [scrollProgress,setScrollProgress]=useState(0)
  const handleScroll=()=>{
    const scrollTop=window.scrollY
    const windowHeight=document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrollPercent=(scrollTop/windowHeight)*100
    setScrollProgress(scrollPercent)
  }
  useEffect(()=>{
    window.addEventListener('scroll',handleScroll)

    return()=>{
      window.removeEventListener('scroll',handleScroll)
    }
  },[])
  return (
    <div >
      <div className="fixed z-50 w-full">
     
      <Row justify={"center"} className="bg-[#114098]">
        <Col span={2}></Col>
        <Col span={20}>
        <Link to='/' className="no-underline">
              <div className="text-white text-[25px] font-lobster cursor-pointer float-left py-3 absolute ml-3">
                {" "}
                Take A Breath
              </div>
              </Link>
          <div className="bg-[#114098] flex justify-between pt-12 pb-8">
           
            <ul className="flex items-end ">
            <Link to="/" className={hoverEffect}>
              <li className='w-28 '>               
                    {t('booking')}    
              </li>
              </Link>
                <Link to="/" className={hoverEffect}>
              <li className='w-28'>
                 {t('activities')}
              </li>
                </Link>
              <Link to="/" className={hoverEffect}>
              <li className='w-24'>
                  {t('coupons')}
              </li>
                </Link>
                <Link to="/" className={hoverEffect}>
              <li className='w-28'>
                  {t('favs')}
              </li>
                </Link>
           
            </ul>
          
            <div className="items-start">
            <ul className="flex space-x-4 cursor-pointer">
            <li className="flex">
          <ChangeLangButton color="white" underlineColor="yellow"/>
             </li>
            <li className="w-20">
           <p className={hoverEffect}> {t('partners')}</p>
             </li>
             <Link to='/about-us' className='no-underline'>
             <li className='w-32'>
              <p className={hoverEffect}> {t('about-us')}</p>
             </li>
             </Link>
            

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
         {/* //progress bar */}
      </Row>   
      <ProgressBar style={{width:`${scrollProgress}%`, marginTop:'-5px'}}></ProgressBar>

      </div>
      <div className="pt-[120px]">
      {children}

      </div>
    </div>
  );
};
const ProgressBar=styled.div`
position:fixed;
left:0;
width:0;
height:5px;
z-index:50;
transition: width 0.2s ease-in-out;
background-color: #15b3b6;
`
export default Header;