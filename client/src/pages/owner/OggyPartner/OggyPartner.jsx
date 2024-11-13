import React from 'react'
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

export const OggyPartner = () => {
    const navigate=useNavigate();

    const handleClickOggyCreateButton=()=>{
        const token=localStorage.getItem('token')
        console.log('token',token)
        const callbacklink=`https://takeabreath.io.vn/owner`
        window.location.href = `https://voucher4u.io.vn/sso?Token=${token}&URLCallBack=${callbacklink}`
        navigate(window.location.href)
    }
    return (
        <Button onClick={handleClickOggyCreateButton} variant='primary' className='mt-4'>Create Oggy Partner Voucher</Button>
    )
}
