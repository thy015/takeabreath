import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, ConfigProvider } from 'antd'
import { MenuOutlined } from '@ant-design/icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMediaQuery } from 'react-responsive';
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
    {
        key: "owner/Vouchers",
        label: (<p className='font-bold'>Phiếu giảm giá</p>),
    },
    {
        key: "owner/OggyPartner",
        label: (<p className='font-bold'>Oggy Partner</p>),
    },
    {
        key: "owner/Card",
        label: (<p className='font-bold'>Quản lý thẻ</p>),
    }

]


function SideBar({isMenu,setIsMenuOpen}) {
    const navigate = useNavigate()
    const location = useLocation();
    const selectedKey = location.pathname.slice(1) || 'Revenue'
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const hanldeClickItem = ({ item, key, keyPath, domEvent }) => {
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
                    <div className={ isMobile ?'absolute right-4 top-4':"hidden"} onClick={setIsMenuOpen}>
                        <FontAwesomeIcon className={"text-[30px] text-white"} icon={faXmark} />
                    </div>

                </div>
                <p className="text-[12px] font-extrabold leading-[16px] text-white py-[10px]">
                    MANAGE
                </p>
                <Menu
                    items={items}
                    onClick={hanldeClickItem}
                    selectedKeys={[selectedKey]}
                />
            </div>
        </ConfigProvider>
    )
}

export default SideBar