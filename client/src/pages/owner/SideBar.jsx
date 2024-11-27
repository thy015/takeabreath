import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, ConfigProvider } from 'antd'
import { MenuOutlined } from '@ant-design/icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import { AuthContext } from '../../hooks/auth.context';
const items = [
    {
        key: "owner/Revenue",
        label: (<p className='font-bold'>Thống kê doanh thu</p>),
    },
    {
        key: "owner/Hotel",
        label: (<p className='font-bold'>Khách sạn</p>),
    },
    {
        key: "owner/Room",
        label: (<p className='font-bold'>Phòng</p>),
    },
    // {
    //     key: "owner/Vouchers",
    //     label: (<p className='font-bold'>Phiếu giảm giá</p>),
    // },
    {
        key: "owner/OggyPartner",
        label: (<p className='font-bold'>Oggy Partner</p>),
    },
    {
        key: "owner/Card",
        label: (<p className='font-bold'>Quản lý thẻ</p>),
    }

]
const itemAccount = [
    {
        key: "owner/Profile",
        label: (<p className='font-bold'>Tài khoản</p>),
    },
    {
        key: "logout",
        label: (<p className='font-bold'>Đăng xuất</p>),
    }

]


function SideBar({ isMenu, setIsMenuOpen }) {
    const navigate = useNavigate()
    const location = useLocation();
    const selectedKey = location.pathname.slice(1) || 'Revenue'
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const {setAuth} = useContext(AuthContext)
    const BE_PORT = import.meta.env.VITE_BE_PORT
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

    const hanldeClickItem = ({ item, key, keyPath, domEvent }) => {
        if (key == "logout") {
            hanldeLogout()
            return
        }
        navigate(`/${key}`)
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
                        <FontAwesomeIcon className={"text-[30px] text-white"} icon={faXmark} />
                    </div>

                </div>
                <p className="text-[20px] font-extrabold leading-[16px] text-white pb-[10px] mt-[30px]">
                    MANAGE
                </p>
                <Menu
                    items={items}
                    onClick={hanldeClickItem}
                    selectedKeys={[selectedKey]}
                />
                <p className="text-[20px] font-extrabold leading-[16px] text-white pb-[10px] mt-[20px] border-t-[1px] border-[#EDEDED]/[0.3] pt-[30px] ">
                    PROFILE
                </p>
                <Menu
                    items={itemAccount}
                    onClick={hanldeClickItem}
                    selectedKeys={[selectedKey]}
                />
            </div>
        </ConfigProvider>
    )
}

export default SideBar