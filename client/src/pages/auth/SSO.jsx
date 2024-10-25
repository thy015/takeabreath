import React, { useEffect,useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {useJwt} from 'react-jwt'
import { AuthContext } from '../../hooks/auth.context'
import Cookies from 'js-cookie'
import axios from 'axios'
const SSO = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('Token');
  const { decodedToken, isExpired } = useJwt(token);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (decodedToken && !isExpired) {
      console.log('decoded token on SSO:', decodedToken);
      Cookies.set('Token',token,{expires:1})
        axios.post('http://localhost:4000/api/auth/signInSSO',{token},{withCredentials: true})
        .then((res)=>{
          console.log(res.data)
          navigate(res.data.redirectPath);
        })
      .catch(e=>{
        console.log(e.message);
      })
    }
    if (isExpired) {
      console.log('Token is expired');
    }
  }, [decodedToken, isExpired, login, navigate])

    
  return (
    <>
    <style>
        {`
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 4px #00FFFF; }
            50% { text-shadow: 0 0 40px #00FFFF; }
          }
        `}
      </style>
    <div className='bg-black h-screen w-screen flex justify-center items-center flex-col'>
      <img src='https://i.redd.it/ubbi1p7z7euc1.gif' alt='Loading' />
      <div className='text-2xl font-bold text-[#00FFFF]' style={{animation: 'glow 2s ease-in-out infinite'}}>
        Loading SSO Authentication...
      </div>
    </div>
    </>
  )
}

export default SSO