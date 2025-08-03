import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom'
import {Menu, ConfigProvider} from 'antd'
import PropTypes from "prop-types";
import {X} from "lucide-react";
import {authApis} from "@/apis/auth/auth";
import {useToastNotifications} from "@/hooks/useToastNotification";
import {useIsMobile} from "@/hooks/useIsMobile";

const items = [
  {
    key: "owner/revenue",
    label: (<p className='font-bold'>Thống kê doanh thu</p>),
  },
  {
    key: "owner/hotel",
    label: (<p className='font-bold'>Khách sạn</p>),
  },
  {
    key: "owner/room",
    label: (<p className='font-bold'>Phòng</p>),
  },
  {
      key: "owner/vouchers",
      label: (<p className='font-bold'>Phiếu giảm giá</p>),
  },
  {
    key: "owner/card",
    label: (<p className='font-bold'>Quản lý thẻ</p>),
  }

]
const itemAccount = [
  {
    key: "owner/profile",
    label: (<p className='font-bold'>Tài khoản</p>),
  },
  {
    key: "logout",
    label: (<p className='font-bold'>Đăng xuất</p>),
  }

]

function SideBar ({setIsMenuOpen}) {
  SideBar.propTypes = {
    setIsMenuOpen: PropTypes.func.isRequired,
  };
  const navigate = useNavigate ()
  const location = useLocation ();
  const selectedKey = location.pathname.slice (1) || 'owner/revenue'
  const isMobile = useIsMobile()
  const toast=useToastNotifications()

  const handleLogOut = () => {
    try{
      const res= authApis.logOut()
      if (res.logout) {
        toast.showSuccess('Log out successfully')
        navigate ('/login')
      }
      toast.showError('Failed to log out')
    }catch (err) {
      console.error (err)
      toast.showError(err.message || 'Failed to log out')
    }
  }

  const handleClickItem = ({key}) => {
    if (key === "logout") {
      handleLogOut ()
      return
    }
    navigate (`/${key}`)
  }
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemBg: "bg-[#003580]",
            itemColor: "white",
            itemHoverColor: "bg-[#003580]",
            itemMarginBlock: 10
          },
        },
        token: {
          fontSize: "16px",
          fontWeigh: "bold"
        },
      }}
    >
      <div className={`bg-[#003580] relative h-full px-[25px] rounded-r-[20px]  transition-transform duration-300`}>

        <div className="px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]">
          <h1 className="text-white text-[20px] leading-[24px] font-extrabold cursor-pointer">
            TakeABreath
          </h1>
          <div className={isMobile ? 'absolute right-4 top-4' : "hidden"} onClick={setIsMenuOpen}>
            <X size={32} className={"text-[30px] text-white"}/>
          </div>

        </div>
        <p className="text-[20px] font-extrabold leading-[16px] text-white pb-[10px] mt-[30px]">
          MANAGE
        </p>
        <Menu
          items={items}
          onClick={handleClickItem}
          selectedKeys={[selectedKey]}
        />
        <p
          className="text-[20px] font-extrabold leading-[16px] text-white pb-[10px] mt-[20px] border-t-[1px] border-[#EDEDED]/[0.3] pt-[30px] ">
          PROFILE
        </p>
        <Menu
          items={itemAccount}
          onClick={handleClickItem}
          selectedKeys={[selectedKey]}
        />
      </div>
    </ConfigProvider>
  )
}

export default SideBar