import React, { useContext, useState,useEffect } from "react";
 import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
import { AuthContext } from "../../hooks/auth.context";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";
const DashboardView = () => {
  const {auth,setAuth} = useContext(AuthContext)
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const [admin,setAdmin]=useState(null);
  console.log("[Admin Page] ",auth)
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${BE_PORT}/api/auth/admin/${auth?.user?.id}`);
      setAdmin(response.data); 
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  useEffect(() => {
    if (auth?.user?.id) {
      fetchAdmin();
    }
  }, []);
  axios.defaults.withCredentials = true
  const showProfile = () => {
    setOpen(!open);
  };
  const hanldeLogout = ()=>{
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
    <div className="">
      <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] border-b-2 ">
        <div className="flex items-center rounded-[5px]">
    
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
            <div className="h-[50px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
  <img src={admin?.imgLink} className="h-full w-full object-cover rounded-full" />
</div>

            {open && auth.user.id !==""&& (
              <div className="bg-white border h-[100px] w-[150px] absolute bottom-[-100px] z-20 right-0 pt-[10px]  space-y-[10px]">
              <Link to="settings" className="no-underline text-black"> <p className="cursor-pointer hover:text-[blue] font-semibold">
                 Cài Đặt
                </p>
                </Link> 
                <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={hanldeLogout}>
                  Đăng Xuất
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
