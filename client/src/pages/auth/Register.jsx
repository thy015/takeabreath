import { Link, useNavigate } from "react-router-dom";
import React from 'react'
import axios from 'axios'
import { openNotification } from "../../hooks/notification";
import { useState } from "react";
import { Input, Form, Typography } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Register = () => {
  const navigate = useNavigate()
  const [formRegister] = Form.useForm()
  const email = Form.useWatch('email', formRegister)
  const password = Form.useWatch('password', formRegister)
  const repassword = Form.useWatch('repassword', formRegister)
  const [errMessage, setErrMessage] = useState('')
  const matchPass_Repass = password === repassword

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


  axios.defaults.withCredentials = true

  const handleRegister = (e) => {
    e.preventDefault()
    if (!matchPass_Repass) {
      setErrMessage("Password and repassword dont match!")
      return
    }

    if (!validateEmail(email)) {
      setErrMessage("Email incorret !")
      return
    }

    setErrMessage('')
    axios.post('http://localhost:4000/api/auth/signUpCus', {
      email, password, repassword
    }).then(res => {
      if (res.data.register) {
        openNotification(true, "Register Successful")
        navigate('/login')
      } else {
        setErrMessage('Register failed !')
      }
    }).catch(err => {

      console.log(err.response.data)
      openNotification(false, "Register Failed", err.response.data.message)
    }
    )
  }
  return (

    <div className="h-screen w-full d-flex justify-content-center align-items-center bg-[url('https://wallpapercave.com/wp/wp9764093.jpg')] "  >
      <Form form={formRegister} name="dependencies" className='py-[30px] h-[530px] w-[500px] border-2 border-[#777777 ] rounded-[30px] text-white bg-transparent backdrop-blur-[50px]'>
        <h1 className=" mt-[10px] font-bold ">Register</h1>

        <Form.Item
          className="m-[30px] mt-[40px] text-white"
          label='Email'
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input
            type="email"
            className="bg-transparent max-w-[250px] rounded-[30px] px-[20px] py-[10px] text-white placeholder:text-white"
            placeholder="Enter your password"
            suffix={<FontAwesomeIcon icon={faEnvelope} />}
          />
        </Form.Item>

        <Form.Item
          className="m-[30px] justify-content-center"
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password
            className="bg-transparent max-w-[250px] rounded-[30px] px-[20px] py-[10px] text-white placeholder:text-white"
            placeholder='Enter your password'

          />
        </Form.Item>

        <Form.Item
          className="m-[30px] justify-content-center"
          name="repassword"
          label="Repassword"
          rules={[
            {
              required: true,
              message: 'Please input your repassword!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The new password that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            error
            className="bg-transparent max-w-[250px] rounded-[30px] px-[20px] py-[10px] text-white placeholder:text-white"
            placeholder='Enter your repassword'
          />
        </Form.Item>

        {errMessage !== '' && <Typography className="text-red-500 text-[18px] font-bold ">{errMessage}</Typography>}

        <div>
          <button
            className=" bg-white m-[20px] h-[50px] w-[300px] rounded-[20px] align-text-center text-black font-bold text-[26px]"
            onClick={handleRegister}
          >Register</button>
        </div>

        <div className="my-[20px] mx-] d-flex justify-between ">
          <Link to='/login' className="text-white text-[15px] no-underline ml-[35px]">Do you have account ?</Link>
        </div>
      </Form>
    </div>

  )
}

export default Register