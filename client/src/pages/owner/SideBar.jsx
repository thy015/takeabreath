import React from 'react'
import {useNavigate } from 'react-router-dom'
import { Menu, ConfigProvider } from 'antd'


const items = [
    {
        key: "Revenue",
        label: (<p className='font-bold'>Thống kê doanh thu</p>),
    },
    {
        key: "Hotel",
        label: (<p className='font-bold'>Khách sạn</p>),
    },
    {
        key: "Room",
        label: (<p className='font-bold'>Phòng</p>),
    },
    {
        key: "Vouchers",
        label: (<p className='font-bold'>Phiếu giảm giá</p>),
    },

    {
        key: "Card",
        label: (<p className='font-bold'>Quản lý thẻ</p>),
    },
    {
        key: "OggyPartner",
        label: (<p className='font-bold'>Oggy Partner</p>),
    }
]


function SideBar() {
    const navigate = useNavigate()
    const handleClickItem = ({ item, key, keyPath, domEvent})=>{
        navigate(key)
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
                    fontWeigh:"bold"
                },
            }}
        >
            <div className='bg-[#003580] h-full px-[25px]'>
                <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                    <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'>TakeABreath</h1>
                </div>
                <p className='text-[12px] font-extrabold leading-[16px] text-white py-[10px]'>
                    MANAGE
                </p>
                <Menu
                    style={{

                    }}
                    items={items}
                    onClick={handleClickItem}
                    defaultSelectedKeys={['Revenue']}
                />
            </div>
        </ConfigProvider>
    )
}

export default SideBar