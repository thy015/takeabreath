import React, { useState, useContext } from "react";
import { Form, Input, Tooltip } from "antd";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import axios from "axios";
import { AuthContext } from "../../hooks/auth.context";
import { openNotification } from "../../hooks/notification";
import { motion } from "framer-motion";
import ChangeLangButton from "../../component/ChangeLangButton"
import { useTranslation } from "react-i18next";


const LogInOwner = () => {
  const { t } = useTranslation();
  const { setAuth } = useContext(AuthContext)
  const navigate = useNavigate();
  const [isSignInClicked, setIsSignInClicked] = useState(false);
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const handleSignInClick = () => {
    setIsSignInClicked(true);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    idenCard: '',
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleFormSubmit = async () => {
    const { email, password } = formData;

    if (!email || !password) {
      openNotification(false, "Please fill all the fields");
      return;
    }

    try {
      const response = await axios.post(`${BE_PORT}/api/auth/signInOwner`, formData);
      if (response.status === 200) {
        openNotification(true, "Success login");
        setAuth({
          isAuthenticated: true,
          user: {
            id: response?.data?.id ?? "",
            email: response?.data?.email ?? "",
            name: response?.data?.name ?? "",
            role: response?.data?.role ?? ''
          }
        })
        localStorage.setItem("activeItem","Dashboard")
        navigate(response.data.redirect);
      }
    } catch (e) {
      console.log(e);
      openNotification(
        false,
        "Failed to register",
        e.response.data.message
      );
    }
  };

  return (
    <div>
      <div className="row h-[650px]">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row bg-[#114098] h-full shadow-lg g-0">

            <motion.div
              className="col-7"
              initial={{ opacity: 0 }}
              animate={{
                opacity: isSignInClicked ? 0 : 1,
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                ease: "easeOut",
                delay: 0.15,
              }}
              onAnimationComplete={() => {
                if (isSignInClicked) {
                  navigate("/registerOwner");
                }
              }}
            >
              <div className="row h-full">
                <div className="col-2"></div>
                <div className="col-8">
                  <div className="py-32">
                    <h5 className="font-bold text-[#c3d7ef]">
                      {t('welcome-back')}
                      <span className="text-white"> TAB</span>{" "}
                      {t('partner-login-owner')} !
                    </h5>
                    <div className="flex justify-center">
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 text-[#114098] bg-white hover:scale-105 hover:text-black mx-2 cursor-pointer my-2">
                        <FaGoogle />
                      </div>
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 text-[#114098] bg-white hover:scale-105 hover:text-black mx-2 cursor-pointer my-2">
                        <FaFacebookF />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="border-t border-gray-300 flex-grow"></div>
                      <div className="mx-4 text-white">{t('or')}</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-4">
                      <Form>
                        <Form.Item
                          label={
                            (<div className='w-[100px] flex-center text-white'>{t('email')}</div>)
                        }
                          name="email"
                        >
                          <Input
                            placeholder="anderson@gmail.com"
                            suffix={
                              <Tooltip title="Email must be approriate, example: thymai@hotmail.com">
                                <MdOutlineEmail />
                              </Tooltip>
                            }
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            (<div className='w-[100px] flex-center text-white'>{t('password')}</div>)
                        }
                          name="password"
                        >
                          <Input.Password
                            placeholder="ads123@"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </Form.Item>

                        <Form.Item>
                          <Button
                            onClick={handleFormSubmit}
                            className="my-2 ml-8 hover:scale-105 bg-white"
                            style={{ color: "#114098" }}
                          >
                            {t('sign-in')}
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>

                    <div className="flex justify-start mt-3 text-[#c3d7ef]">
                      <span>{t('not-register-owner')}</span>
                      <span className="text-white cursor-pointer no-underline ml-2" onClick={handleSignInClick}>
                        {t('register-owner')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-2"></div>
              </div>
            </motion.div>
            <div className="col-5 relative border-l">
              {/*<div className="gryphen absolute flex mt-[100px] ml-6 text-white text-semibold text-[20px] italic">*/}
              {/*  {t('we-sincerely-appreciate-your-partnership')}*/}
              {/*</div>*/}

              <img
                className="w-full flex mt-56"
                src="/img/sign-in.svg"
                alt="side-image"
              />
              <div className='absolute flex top-[92%] left-[70%]'>
                <ChangeLangButton color='white' underline='yellow-200'></ChangeLangButton>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default LogInOwner;
