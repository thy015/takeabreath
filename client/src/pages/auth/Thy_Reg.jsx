import React, {  useState } from "react";
import { Form, Input, Checkbox, Tooltip } from "antd";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF,FaAccessibleIcon } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaUser, FaPhoneFlip } from "react-icons/fa6";
import axios from "axios";
import { openNotification } from "../../hooks/notification";
import {motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ChangeLangButton from "../../component/ChangeLangButton"
import {SSO} from '@htilssu/wowo'

const validateEmail = (email) => {
  
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Register = () => {
  const sso = new SSO('TAB')
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const {t}=useTranslation()
  const navigate = useNavigate();
  const [isSignInClicked, setIsSignInClicked] = useState(false);
  
  const handleSignInClick = () => {
    setIsSignInClicked(true);
  };
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      agreeTerms: e.target.checked,
    });
  };

  const handleFormSubmit = async () => {
    const { email, password, name, phone, agreeTerms } = formData;

    if (!email || !password || !name || !phone) {
      openNotification(false, "Please fill all the fields");
      return;
    }

    if (!validateEmail(email)) {
      openNotification(false, "Invalid email format");
      return;
    }

    if (password.length <= 8) {
      openNotification(false, "Password should be at least 8 characters");
      return;
    }

    if (phone.length !== 10 || !phone.startsWith("0")) {
      openNotification(false, "Phone must be 10 digits and start with 0");
      return;
    }
    if (!agreeTerms) {
      openNotification(false, "You must agree to the terms of service");
      return;
    }
    try {
      const response = await axios.post(`${BE_PORT}/api/auth/signUpCus`, formData);
      if (response.status === 200) {
        openNotification(true, "Success register");
        navigate("/login");
      }
    } catch (e) {
      console.log(e + "Error passing form data");
      openNotification(
        false,
        "Failed to register",
        "Please try again after 5 minutes"
      );
    }
  };
//sso

function handleLoginSSO() {
  sso.redirectToLogin("https://takeabreath.io.vn/sso")
}
  return (
    <div>
      <div className="row h-[550px]">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row bg-slate-50 h-full shadow-lg g-0">
            <div
              className="col-4 relative"  >
              <div className="gryphen italic text-white text-[20px] absolute flex mt-40 ml-8">{t('have-your-fun-journey-with-tab')}</div>
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1530273883449-aae8b023c196?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="side-image"
              />
            </div>
            <motion.div
              className="col-8"
              initial={{opacity: 0 }}
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
                  navigate("/login");
                }
              }}
            >
              <div className="row h-full">
                <div className="col-2"></div>
                <div className="col-8">
                  <div className="py-7">
                    <h5 className="font-bold">
                    {t('register-with')}{" "}
                      <span className="text-[#114098]">TakeABreath</span>{" "}
                    </h5>
                    <div className="flex justify-center">
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaGoogle />
                      </div>
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaFacebookF />
                      </div>
                      <div onClick={handleLoginSSO} className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaAccessibleIcon />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="border-t border-gray-300 flex-grow"></div>
                      <div className="mx-4">{t('or')}</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-4">
                      <Form>
                        <Form.Item label={
                          (<div className='w-[100px] flex-center'>{t('email')}</div>)
                        } name="email">
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
                        <Form.Item label= {
                          (<div className='w-[100px] flex-center'>{t('password')}</div>)
                        } name="password">
                          <Input.Password
                            placeholder="ads123@"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                        <Form.Item label={
                          (<div className='w-[100px] flex-center'>{t('name')}</div>)
                        }>
                          <Input
                            placeholder="Anderson"
                            suffix={<FaUser />}
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                        <Form.Item label=  {
                          (<div className='w-[100px] flex-center'>{t('phone-number')}</div>)
                        }>
                          <Input
                            placeholder="0908xxxxxx"
                            suffix={<FaPhoneFlip />}
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Checkbox
                            checked={formData.agreeTerms}
                            onChange={handleCheckboxChange}
                          >
                            {t('i-agree')}
                          </Checkbox>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            onClick={handleFormSubmit}
                            className="my-2 ml-8 hover:scale-105"
                          >
                           {t('create-account')}
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                    <div className="flex justify-start">
                      <span>{t('im-already-a-member')}</span>

                      <span
                        className="text-[#114098] cursor-pointer no-underline ml-2"
                        onClick={handleSignInClick}
                      >
                        {t('sign-in')}
                      </span>
                    </div>
                    <div className="flex justify-start mt-3">
                      <span>{t('im-an-owner')}</span>
                      <Link to="/loginOwner" className="no-underline">
                        <span className="text-[#114098] cursor-pointer no-underline ml-2">
                        {t('sign-in-owner')}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-2 flex justify-start items-end">
                <div className=" flex">
                <ChangeLangButton color="black" underlineColor='green-500' />
                </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default Register;
