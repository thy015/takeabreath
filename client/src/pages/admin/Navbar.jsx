import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authApis} from "@/apis/auth/auth";
import {clearAuthData} from "@/store/redux/auth";
import {useToastNotifications} from "@/hooks/useToastNotification";
import { Mail, MessageCircleWarning} from "lucide-react";

const DashboardView = () => {
  const [open, setOpen] = useState (false);
  const auth = useSelector ((state) => state.auth);
  const dispatch=useDispatch()
  const navigate=useNavigate();
  const toast=useToastNotifications()

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

  return (
    <div>
      <div className="flex items-center justify-between h-[70px] shadow-lg px-[25px] border-b-2 ">
        <div className="flex items-center rounded-[5px]">

        </div>
        <div className="flex items-center gap-[20px]">
          <div className="flex items-center gap-[25px] border-r-[1px] pr-[25px]">
            <MessageCircleWarning/>
            <Mail/>
          </div>
          <div
            className="flex items-center gap-[15px] relative"
          >
            <div className='text-xl font-afacad'>{auth?.name || "Admin"}</div>
            <div
              className="h-[50px] w-[50px] rounded-full cursor-pointer flex items-center justify-center relative z-40">
              <img src='/icon/Avatar%20Cute/kitten.png' className="h-full w-full object-cover rounded-full" onClick={()=>setOpen(!open)}/>
            </div>

            {open && auth.id !== "" && (
              <div
                className="bg-white border h-auto w-[150px] absolute bottom-[-100px] z-20 right-0 pt-[10px] p-2 space-y-[10px]">
                <Link to="settings" className="no-underline text-black"><p
                  className="cursor-pointer hover:text-[blue] font-semibold">
                  Cài Đặt
                </p>
                </Link>
                <p className="cursor-pointer hover:text-[blue] font-semibold" onClick={handleLogOut}>
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
