import React from "react";
import { Form, Input, Checkbox, Tooltip } from "antd";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { FaUser, FaPhoneFlip } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useToastNotifications } from "@/hooks/useToastNotification";
import {registerSchema} from "@/lib/validators/auth/auth-validate";
import {authApis} from "@/apis/auth/auth";
import ChangeLangButton from "@/components/ChangeLangButton";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToastNotifications();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      await authApis.registerUser(data);
      toast.showSuccess("Success register");
      navigate("/");
    } catch (e) {
      toast.showError(e.message || "Failed to register");
    }
  };

  return (
    <div>
      <div className="h-[550px]">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row bg-slate-50 h-full shadow-lg g-0">
            <div className="col-4 relative">
              <div className="gryphen italic text-white text-[20px] absolute flex mt-40 ml-8">
                {t("have-your-fun-journey-with-tab")}
              </div>
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1530273883449-aae8b023c196?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="side-image"
              />
            </div>
            <motion.div
              className="col-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.75,
                ease: "easeOut",
                delay: 0.15,
              }}
            >
              <div className="row h-full">
                <div className="col-2"></div>
                <div className="col-8">
                  <div className="py-7">
                    <h5 className="font-bold">
                      {t("register-with")}{" "}
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
                      <div className="mx-4">{t("or")}</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t("email")}
                            </div>
                          }
                          validateStatus={errors.email ? "error" : ""}
                          help={errors.email?.message}
                        >
                          <Input
                            placeholder="anderson@gmail.com"
                            suffix={
                              <Tooltip title="Email must be appropriate, example: thymai@hotmail.com">
                                <MdOutlineEmail />
                              </Tooltip>
                            }
                            {...register("email")}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t("password")}
                            </div>
                          }
                          validateStatus={errors.password ? "error" : ""}
                          help={errors.password?.message}
                        >
                          <Input.Password
                            placeholder="ads123@"
                            {...register("password")}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t("name")}
                            </div>
                          }
                          validateStatus={errors.name ? "error" : ""}
                          help={errors.name?.message}
                        >
                          <Input
                            placeholder="Anderson"
                            suffix={<FaUser />}
                            {...register("name")}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t("phone-number")}
                            </div>
                          }
                          validateStatus={errors.phone ? "error" : ""}
                          help={errors.phone?.message}
                        >
                          <Input
                            placeholder="0908xxxxxx"
                            suffix={<FaPhoneFlip />}
                            {...register("phone")}
                          />
                        </Form.Item>
                        <Form.Item
                          validateStatus={errors.agreeTerms ? "error" : ""}
                          help={errors.agreeTerms?.message}
                        >
                          <Checkbox {...register("agreeTerms")}>
                            {t("i-agree")}
                          </Checkbox>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="submit"
                            className="my-2 ml-8 hover:scale-105"
                            disabled={isSubmitting}
                          >
                            {t("create-account")}
                          </Button>
                        </Form.Item>
                      </form>
                    </div>
                    <div className="flex justify-start">
                      <span>{t("im-already-a-member")}</span>
                      <Link
                        to="/login"
                        className="text-[#114098] cursor-pointer no-underline ml-2"
                      >
                        {t("sign-in")}
                      </Link>
                    </div>
                    <div className="flex justify-start mt-3">
                      <span>{t("im-an-owner")}</span>
                      <Link to="/loginOwner" className="no-underline">
                        <span className="text-[#114098] cursor-pointer no-underline ml-2">
                          {t("sign-in-owner")}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-2 flex justify-start items-end">
                  <div className=" flex">
                    <ChangeLangButton
                      color="black"
                      underlineColor="green-500"
                    />
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
