import React, {useState} from "react";
import {Form, Input, Tooltip} from "antd";
import {Button} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {FaGoogle, FaFacebookF} from "react-icons/fa";
import {MdOutlineEmail} from "react-icons/md";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";
import {useToastNotifications} from "@/hooks/useToastNotification";
import ChangeLangButton from "@/components/ChangeLangButton";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {signInSchema} from "@/lib/validators/auth/auth-validate";
import {useMutation} from "@tanstack/react-query";
import {authApis} from "@/apis/auth/auth";
import {useDispatch} from "react-redux";
import {setAuthData} from "@/store/redux/auth";

const Login = () => {
  const {t} = useTranslation ();
  const toast = useToastNotifications ();
  const navigate = useNavigate ();
  const dispatch = useDispatch ()
  const [isRegisterClicked, setIsRegisterClicked] = useState (false);

  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm ({
    resolver: zodResolver (signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });
  const signInMutation = useMutation ({
    mutationFn: authApis.signInUser,
    onSuccess: (data) => {
      toast.showSuccess ('Sign in successfully!');
      dispatch (setAuthData (data))
      navigate (data.redirect);
    },
    onError: (error) => {
      toast.showError (error.message || "Failed to login");
    }
  });
  const onSubmit = async (data) => {
    signInMutation.mutate (data)
  };

  const handleRegisterClicked = () => {
    setIsRegisterClicked (!isRegisterClicked);
    navigate ("/register");
  };

  return (
    <div className='min-h-screen flex-center' style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1530273883449-aae8b023c196?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      backgroundSize: "cover",
      backgroundPosition: "center center",
    }}>
      <div className="row h-[635px]">
        <div className="col-2"></div>
        <div className="col-8">
          <div className="row bg-slate-50 h-full shadow-lg g-0">
            <div className="col-8">
              <div className="row h-full">
                <div className="col-2 flex justify-start items-end">
                  <div className="pl-4 flex">
                    <ChangeLangButton
                      color="black"
                      underlineColor="green-500"
                    />
                  </div>
                </div>
                <motion.div
                  className="col-8"
                  initial={{opacity: 0}}
                  animate={{
                    opacity: isRegisterClicked ? 0 : 1,
                  }}
                  exit={{opacity: 0}}
                  transition={{
                    duration: 0.75,
                    ease: "easeOut",
                    delay: 0.15,
                  }}
                  onAnimationComplete={() => {
                    if (isRegisterClicked) {
                      navigate ("/register");
                    }
                  }}
                >
                  <div className="pt-20 flex flex-col">
                    <h5 className="font-bold text-center">
                      {t ("sign-in-with")}
                      <span className="text-[#114098] ml-2">
                        TakeABreath
                      </span>{" "}
                    </h5>
                    <div className="flex justify-center">
                      <div
                        className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaGoogle/>
                      </div>
                      <div
                        className="flex w-10 h-10 justify-center items-center shadow-md rounded-[22px] transition-colors duration-300 hover:bg-[#114098] hover:text-white mx-2 cursor-pointer my-2">
                        <FaFacebookF/>
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="border-t border-gray-300 flex-grow"></div>
                      <div className="mx-4">{t ("or-register")}</div>
                      <div className="border-t border-gray-300 flex-grow"></div>
                    </div>
                    <div className="mt-12">
                      <form onSubmit={handleSubmit (onSubmit)} noValidate>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t ("email")}
                            </div>
                          }
                          validateStatus={errors.email ? "error" : ""}
                          help={errors.email?.message}
                          className="css-label"
                        >
                          <Controller
                            name="email"
                            control={control}
                            render={({field}) => (
                              <Input
                                {...field}
                                placeholder="anderson@gmail.com"
                                suffix={
                                  <Tooltip title="Email must be appropriate, example: thymai@hotmail.com">
                                    <MdOutlineEmail/>
                                  </Tooltip>
                                }
                                autoComplete="email"
                              />
                            )}
                          />
                        </Form.Item>
                        <Form.Item
                          label={
                            <div className="w-[100px] flex-center">
                              {t ("password")}
                            </div>
                          }
                          validateStatus={errors.password ? "error" : ""}
                          help={errors.password?.message}
                        >
                          <Controller
                            name="password"
                            control={control}
                            render={({field}) => (
                              <Input.Password
                                {...field}
                                placeholder="ads123@"
                                autoComplete="current-password"
                              />
                            )}
                          />
                        </Form.Item>
                        <Form.Item className='flex-center'>
                          <Button
                            type="submit"
                            className="my-2 hover:scale-105"
                            disabled={isSubmitting}
                          >
                            {t ("sign-in")}
                          </Button>
                        </Form.Item>
                      </form>
                    </div>
                    <div className="flex justify-start mt-12">
                      <span>{t ("not-having-an-account-yet")}</span>
                      <span
                        className="text-[#114098] cursor-pointer no-underline ml-2"
                        onClick={handleRegisterClicked}
                      >
                        {" "}
                        {t ("register")}
                      </span>
                    </div>
                    <div className="flex justify-start mt-3">
                      <span>{t ("im-an-owner")}</span>
                      <Link to="/loginOwner" className="no-underline">
                        <span className="text-[#114098] cursor-pointer no-underline ml-2">
                          {t ("sign-in-owner")}
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>
                <div className="col-2"></div>
              </div>
            </div>
            <div className="col-4 relative">
              {" "}
              <div className="gryphen italic text-white text-[20px] absolute flex mt-40 ml-8">
                {t ("have-your-fun-journey-with-tab")}
              </div>
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
