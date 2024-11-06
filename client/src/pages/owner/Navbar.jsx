import React, { useContext, useState } from "react";
 import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
import { AuthContext } from "../../hooks/auth.context";
import { useNavigate } from "react-router-dom";
import { MenuOutlined } from '@ant-design/icons';
import axios from "axios";
function Navbar({isMenuOpen,setIsMenuOpen}) {
    const {auth,setAuth} = useContext(AuthContext)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    axios.defaults.withCredentials = true
    const showProfile = () => {
      setOpen(!open);
    };
    const hanldeLogout = ()=>{
      axios.get("http://localhost:4000/api/auth/logout")
      .then(res => {
        if (res.data.logout) {
          setAuth({
            isAuthenticated: false,
            user: {
              id: "",
              email: '',
              name: '',
            }
          })
          navigate('/login')
  
        }
      }).catch(err => {
        console.log(err)
      })
    }
  
  return (
    <div>
        <div className="">
      <div className="flex items-center justify-end h-[70px] shadow-lg px-[25px] ">
       
        <div className="flex items-center gap-[20px]">
        <button className="md:hidden absolute top-4 left-4 z-10" onClick={() => setIsMenuOpen(true)}>
                    <MenuOutlined className="text-2xl text-[#003580]" />
                </button>
          <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
             <FaRegBell />
            <FaEnvelope /> 
          </div>
          <div
            className="flex items-center gap-[15px] relative"
            onClick={showProfile}
          >
            <p className="pt-[10px]">{auth.user.name.length >0 ? auth.user.name :auth.user.email }</p>
            <div className="h-[50px] w-[50px] bg-[#4E73DF] cursor-pointer flex items-center justify-center relative z-40">
              <img src="/img/profile.png" alt="" />
            </div>

            {open && (
              <div className="bg-white border h-[120px] w-[150px] absolute bottom-[-135px] z-20 right-0 pt-[10px]  space-y-[10px]">
                <p className="cursor-pointer hover:text-[blue] font-semibold">
                  Profile
                </p>
                <p className="cursor-pointer hover:text-[blue] font-semibold">
                  Settings
                </p>
                <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={hanldeLogout}>
                  Log out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Navbar