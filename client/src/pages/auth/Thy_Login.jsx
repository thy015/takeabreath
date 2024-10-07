import React, { useState } from "react";
import { Form, Input, Checkbox, Tooltip } from "antd";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { motion } from "framer-motion";
import axios from "axios";
import { openNotification } from "../../hooks/notification";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isRegisterClicked, setIsRegisterClicked] = useState(false);
  const handleRegisterClick = () => {
    setIsRegisterClicked(true);
  };
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
        openNotification(true, "Success login");
        navigate("/");
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
      <div className="row h-[635px]">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row bg-slate-50 h-full shadow-lg g-0">
            <div className="col-8">
              <div className="row h-full">
                <div className="col-2"></div>
                <motion.div
                  className="col-8"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: isRegisterClicked ? 0 : 1,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.75,
                    ease: "easeOut",
                    delay: 0.15,
                  }}
                  onAnimationComplete={() => {
                    if (isRegisterClicked) {
                      navigate("/register");
                    }
                  }}
                >
                  <div className="pt-20">
                    <h5 className="font-bold">
                      Sign In with{" "}
                      <span className="text-[#114098]">TakeABreath</span>{" "}
                    </h5>
                    <div className="flex justify-center">
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaGoogle />
                      </div>
                      <div className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaFacebookF />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="border-t border-gray-300 flex-grow"></div>
                      <div className="mx-4">or</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-12">
                      <Form>
                        <Form.Item label="Email" name="email">
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
                        <Form.Item label="Password" name="password">
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
                            className="my-2 hover:scale-105"
                          >
                            Sign In
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                    <div className="flex justify-start mt-12">
                      <span>Not having an account yet?</span>
                      <span
                        className="text-[#114098] cursor-pointer no-underline ml-2"
                        onClick={handleRegisterClick}
                      >
                        {" "}
                        Register
                      </span>
                    </div>
                    <div className="flex justify-start mt-3">
                      <span>I'm an owner</span>
                      <Link to="/loginOwner" className="no-underline">
                        <span className="text-[#114098] cursor-pointer no-underline ml-2">
                          Sign In Owner
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
                <div className="col-2"></div>
              </div>
            </div>
            <div
              className="col-4 relative"
            > <div className="gryphen italic text-white text-[20px] absolute flex mt-40 ml-8">Have your fun journey with TAB</div>
              <img
                className="h-full w-full object-cover img-out"
                src="https://images.unsplash.com/photo-1530273883449-aae8b023c196?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

export default Login;
