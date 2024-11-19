import React, { useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useJwt } from 'react-jwt'
import { AuthContext } from '../../hooks/auth.context'
import axios from 'axios'
import {openNotification} from "../../hooks/notification";
const SSO = () => {
  const {auth,setAuth} = useContext(AuthContext)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('Token');
  const { decodedToken, isExpired } = useJwt(token);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const BE_PORT=import.meta.env.VITE_BE_PORT

  useEffect(() => {
    const setToken=async()=> {
      localStorage.setItem('token',token)
      if (decodedToken && !isExpired) {
        console.log('receive token',decodedToken)
        if (decodedToken.role === 'user') {
          axios.post(`${BE_PORT}/api/auth/login-with-sso`, {decodedToken}, {withCredentials: true})
              .then(res => {
                setAuth({
                  isAuthenticated: true,
                  user: {
                    id: res?.data?.id ?? "",
                    email: res?.data?.email ?? "",
                    name: res?.data?.name ?? "",
                    role: res?.data?.role ?? ''
                  }
                })
                console.log('Console log auth', auth)

              })
              .catch(err => {
                console.log(err)
              })
          navigate('/');
        } else if (decodedToken.role === 'partner') {
          const res=await
              axios.post(`${BE_PORT}/api/auth/check-existed-partner`, {decodedToken},{withCredentials:true})
          // chưa đăng kí
          if(res.status===202){
            console.log('set item token fail',token)
            navigate('/strict-signin-owner', {state: decodedToken})
          } else if(res.status===200){
            console.log('set item token succ',token)
            setAuth({
              isAuthenticated: true,
              user: {
                id: res?.data?.id ?? "",
                email: res?.data?.email ?? "",
                name: res?.data?.name ?? "",
                role: res?.data?.role ?? ''
              }
            })
            openNotification(true, "Success login");
            navigate('/owner')
          }else{
            openNotification(false, "Cant resolve SSO FE",res.data.message);
          }
        }
      }
      if (isExpired) {
        console.log('Token is expired');
      }
    }
    setToken()
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
        <div className='text-2xl font-bold text-[#00FFFF]' style={{ animation: 'glow 2s ease-in-out infinite' }}>
          Loading SSO Authentication...
        </div>
      </div>
    </>
  )
}

export default SSO