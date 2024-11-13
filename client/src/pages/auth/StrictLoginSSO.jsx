import React, {useEffect, useState} from 'react'
import {Form, Input} from "antd";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import {Button} from "react-bootstrap";
import {openNotification} from "../../hooks/notification";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";
const StrictLoginSSO = () => {
    // init value
    const location = useLocation();
    //receive token from SSO Page
    const token=location.state
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const navigate=useNavigate();
    useEffect(()=>{
        if(location.state){
            console.log('token',location.state)
        }
    })
    // handle form
    const [formData,setFormData]=useState({
        phoneNum:'',
        idenCard:'',
        checkbox:false
    })
    const handleInputChange=(e)=>{
        if(typeof e ==='string'){
            setFormData({
                ...formData,
                phoneNum:e,
            })
        }else{
       const {name,value}=e.target
        setFormData({
            ...formData,
            [name]:value
        })
        }
    }
    const handleCheckBoxChange=(e)=>{
        setFormData({
            ...formData,
            checkbox: e.target.checked
        })
    }
    const handleFormSubmit=async()=>{
        const {phoneNum,idenCard,checkbox} = formData;
        if (!phoneNum || !idenCard || !checkbox){
            openNotification(false, "Please fill all the fields");
        }
        const data={
            ...formData,
            token
        }
        try{
            const res=await axios.post(`${BE_PORT}/api/auth/strict-signin-sso`,data);
            if (res.status === 200) {
               openNotification(true, "Success register");
               navigate('/owner')
            }
            else{
                openNotification(false, "You already have account",res.data.message);
            }
        }catch(e){
            console.log('Error in StrictSSO',e.message)
        }
    }
    return (
        <div>
            <div className='row'>
                <div className='col-2'></div>
                <div className='col-8'>
                    <div className='w-full h-[600px] bg-white shadow-2xl'>
                        <div className='row'>
                            <div className='col-6'>
                                <div className='row'>
                                    <div className='col-2'></div>
                                    {/*left section*/}
                                    <div className='col-8'>
                                        <div className='pt-20 font-afacad'>
                                            <div className='font-semibold text-3xl'>Required Register for Oggy Owner</div>
                                            <div className='py-3 text-muted'>Please notice that you will not create an TAB account until you
                                                finished required register
                                            </div>
                                        </div>
                                        <Form className='py-4'>
                                            <Form.Item name='phoneNum' label='Phone Number'>
                                                <PhoneInput
                                                    defaultMask="... ... ..."
                                                    enableLongNumbers={false}
                                                    inputStyle={{ width: '100%'}}
                                                    placeholder='909444xxx'
                                                    name='phoneNum'
                                                    value={formData.phoneNum}
                                                    onChange={handleInputChange}
                                                ></PhoneInput>
                                            </Form.Item>
                                            <Form.Item name='idenCard' label='Identity Card'>
                                                <Input
                                                placeholder='Identity Card'
                                                value={formData.idenCard}
                                                name='idenCard'
                                                onChange={handleInputChange}
                                                >
                                                </Input>
                                            </Form.Item>
                                            <Form.Item>
                                                <input type='checkbox' name='checkbox'
                                                       checked={formData.checkbox}
                                                       onChange={handleCheckBoxChange}>
                                                </input>
                                                <span> I agree with all statements in terms of service</span>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button variant='primary' onClick={handleFormSubmit}>Submit</Button>
                                            </Form.Item>
                                        </Form>
                                    </div>
                                </div>

                                <div className='col-2'></div>
                            </div>

                            {/*right section*/}
                            <div className='col-6'>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-2'></div>
            </div>

        </div>
    )
}
export default StrictLoginSSO
