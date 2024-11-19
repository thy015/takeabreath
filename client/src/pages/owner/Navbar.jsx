import React, { useContext, useState, useEffect } from "react";
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
import { AuthContext } from "../../hooks/auth.context";
import { useNavigate } from "react-router-dom";
import { MenuOutlined } from '@ant-design/icons';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setOwner } from "../../hooks/redux/ownerSlice";
import { Avatar } from "antd";
function Navbar({ isMenuOpen, setIsMenuOpen }) {
  const { auth, setAuth } = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const owner = useSelector(state => state.owner.owner)
  const BE_PORT = import.meta.env.VITE_BE_PORT
  axios.defaults.withCredentials = true
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
  const hanldeLogout = () => {
    axios.get(`${BE_PORT}/api/auth/logout`)
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
              <p className="pt-[10px]">{auth.user.name.length > 0 ? auth.user.name : auth.user.email}</p>
              <div className="h-[50px] w-[50px] cursor-pointer flex items-center justify-center relative z-40">
                <Avatar className="w-full h-full" src={owner.avatarLink?.length>0  ? owner.avatarLink: "https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg"} alt="" />

              </div>

              {open && (
                <div className="bg-white border h-[80px] w-[150px] absolute bottom-[-95px] z-20 right-0 pt-[10px]  space-y-[10px]">
                  <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={() => { navigate("Profile") }}>
                    Profile
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