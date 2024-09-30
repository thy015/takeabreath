import { Link,useNavigate } from "react-router-dom";
import React, { useContext } from 'react'
import axios from 'axios'
import { useState } from "react";
import { Input, Form,Typography } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { openNotification } from "../../hooks/notification";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { AuthContext } from "../../hooks/auth.context";
function LoginOwner() {
  const {auth,setAuth} = useContext(AuthContext)
  const [formLogin] = Form.useForm()
  const email = Form.useWatch('username',formLogin)
  const password = Form.useWatch('password',formLogin)
  const [errMessage,setErrMessage] = useState('')
  const navigate= useNavigate()

  axios.defaults.withCredentials=true
  const handleLogin = (e) => {
    e.preventDefault()
    axios.post("http://localhost:4000/api/auth/signInOwner",{email,password})
      .then(res=>{
        console.log(res)
        if(res.data.login){
          setErrMessage('')
          setAuth({
            isAuthenticated: true,
            user:{
              id: res?.data?.id ?? "",
              email:res?.data?.email ?? "",
              name:res?.data?.name ?? ""
            }
          })
          openNotification(true,"Login Successful","")
          console.log("[LOGIN]",auth)
          navigate(res.data.redirect)
        }
      }).catch(err=>{
        openNotification(false,"Login Failed",err.response.data.message)
      })

  }
  return (

    <div className="h-screen w-full d-flex justify-content-center align-items-center bg-[url('https://wallpapercave.com/wp/wp9764093.jpg')] "  >
      <Form form={formLogin} className='py-[30px] h-[450px] w-[500px] border-2 border-[#777777 ] rounded-[30px] text-white bg-transparent backdrop-blur-[50px]'>
        <h1 className=" mt-[10px] font-bold ">Login Owner</h1>

        <Form.Item 
          className="m-[30px] mt-[40px] text-white"
          label='Username'
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input
            className="bg-transparent max-w-[250px] rounded-[30px] px-[20px] py-[10px] login-form"
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
              message: 'Please input your username!',
            },
          ]}
        >
          <Input.Password
            className="bg-transparent max-w-[250px] rounded-[30px] px-[20px] py-[10px] login-form"
            placeholder='Enter your username'
          />
        </Form.Item>

        {/* {errMessage!=='' && <Typography className="text-red-500 text-[18px] font-bold ">{errMessage}</Typography>}
 */}

        <div>
          <button 
            className=" bg-white m-[20px] h-[50px] w-[300px] rounded-[20px] align-text-center text-black font-bold text-[26px]" 
            onClick={handleLogin}
          >Login</button>
        </div>
        <div className="my-[20px] mx-] d-flex justify-between ">
          <Link to='/registerOwner' className="text-white text-[15px] no-underline ml-[35px]">Don't you have account ?</Link>
        </div>

      </Form>
    </div>

  )
}

export default LoginOwner