import React, { useContext, useState } from "react";
 import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
import { AuthContext } from "../../hooks/auth.context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardView = () => {
  const {auth,setAuth} = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()

  console.log("[Admin Page] ",auth)
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
    <div className="">
      <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] ">
        <div className="flex items-center rounded-[5px]">
          <input
            type="text"
            className=" bg-[#F8F9FC] h-[40px] outline-none pl-[13px] w-[350px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
            placeholder="Search for..."
          />
          <div className="bg-[#003580] h-[40px] px-[14px] flex items-center justify-center cursor-pointer rounded-tr-[5px] rounded-br-[5px]">
            { <FaSearch color="white" /> }
          </div>
        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
             <FaRegBell />
            <FaEnvelope /> 
          </div>
          <div
            className="flex items-center gap-[15px] relative"
            onClick={showProfile}
          >
            <p className="pt-[10px]">{auth?.user?.name}</p>
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
  );
};

export default DashboardView;
