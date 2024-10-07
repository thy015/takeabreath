import React, { useState } from "react";
import { Form, Input, Checkbox, Tooltip } from "antd";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF,FaAddressCard } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaUser, FaPhoneFlip } from "react-icons/fa6";
import axios from "axios";
import { openNotification } from "../../hooks/notification";
import { motion } from "framer-motion";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const LogInOwner = () => {
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
    idenCard:'',
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
    const { email, password} = formData;

    if (!email || !password) {
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

    try {
      const response = await axios.post("hieuauthen", formData);
      console.log(response.data);
      if (response.status === 200) {
        openNotification(true, "Success register");
        navigate("/registerOwner");
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
                     Welcome back 
                      <span className="text-white"> TakeABreath</span>{" "}
                      Partner !
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
                      <div className="mx-4 text-white">or</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-4">
                      <Form>
                        <Form.Item
                          label={<span className="white-label">Email</span>}
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
                          label={<span className="white-label">Password</span>}
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
                            Sign In
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                   
                    <div className="flex justify-start mt-3 text-[#c3d7ef]">
                      <span>I'm not register owner yet!</span>
                        <span className="text-white cursor-pointer no-underline ml-2" onClick={handleSignInClick}>
                          Register Owner
                        </span>
                    </div>
                  </div>
                </div>
                <div className="col-2"></div>
              </div>
            </motion.div>
            <div className="col-5 relative border-l">
              <div className="gryphen absolute flex mt-[100px] ml-6 text-white text-semibold text-[20px] italic">
                We sincerely appreciate your partnership
              </div>
              <div className="gryphen absolute flex mt-[130px] ml-[200px] text-white font-bold text-[20px] italic">
                as a<span className="text-[#c3d7ef] mx-2"> TAB </span>
                Partner
              </div>
              <img
                className="w-full flex mt-56"
                src="/img/sign-in.svg"
                alt="side-image"
              />
            </div>
          </div>
        </div>
        <div className="col-2"></div>
      </div>
    </div>
  );
};

export default LogInOwner;
