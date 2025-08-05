import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "antd";
import PropTypes from "prop-types";
import {setOwner} from "@/store/redux/ownerSlice";
import { Logs, Mail} from 'lucide-react'
import {authApis} from "@/apis/auth/auth";
import {clearAuthData} from "@/store/redux/auth";
import {useToastNotifications} from "@/hooks/useToastNotification";
import {MessageCircleWarning} from "lucide-react";

function Navbar({ setIsMenuOpen }) {
  Navbar.propTypes = {
    setIsMenuOpen: PropTypes.func.isRequired,
  }
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)
  const navigate = useNavigate()
  const owner = useSelector(state => state.owner.owner)
  const toast=useToastNotifications()
  const BE_PORT = import.meta.env.VITE_BE_PORT
  axios.defaults.withCredentials = true

  const handleLogOut = async () => {
    try {
      const res= await authApis.logOut()
      if (res.logout) {
        toast.showSuccess ("Logout Successful");
        dispatch (clearAuthData ());
        navigate ("/");
      } else {
        toast.showError ("Logout failed");
      }
    } catch (err) {
      console.error ("Error during logout:", err);
      toast.showError ("An error occurred during logout");
    }
  };

  useEffect(() => {
    axios.get(`${BE_PORT}/api/auth/get-owner`)
      .then(res => res.data)
      .then(data => {
        console.log(data)
        dispatch(setOwner(data.owner))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const showProfile = () => {
    setOpen(!open);
  };

  return (
    <div>
      <div className="">
        <div className="flex items-center justify-end h-[70px] shadow-lg px-[25px] border-none">
          <div className="flex items-center gap-[20px]">
            <button className="md:hidden absolute top-4 left-4 z-10" onClick={() => setIsMenuOpen(true)}>
              <Logs size={32} className="text-2xl text-[#003580]" />
            </button>
            <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
              <MessageCircleWarning/>
              <Mail/>
            </div>

            <div
              className="flex items-center gap-[15px] relative"
              onClick={showProfile}
            >
              <div className='text-xl font-afacad'>{auth.name !== '' ? auth.name : auth.email}</div>
              <div className="h-[50px] w-[50px] cursor-pointer flex items-center justify-center relative z-40">
                <Avatar className="w-full h-full" src={owner.avatarLink?.length>0  ? owner.avatarLink: "https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg"} alt="" />

              </div>
              {open && (
                <div className="bg-white border h-auto w-[150px] absolute bottom-[-95px] z-20 right-0 pt-[10px] space-y-[10px] p-2">
                  <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={() => { navigate("/owner/profile") }}>
                    Profile
                  </p>
                  <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogOut}>
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