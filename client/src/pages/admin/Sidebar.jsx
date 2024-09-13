import React from 'react'
import { FaTachometerAlt,FaHotel,FaUser, FaRegSun, FaWrench, FaStickyNote, FaRegChartBar, FaRegCalendarAlt, FaChevronRight, FaChevronLeft, FaBolt, FaRestroom, FaTicketAlt } from "react-icons/fa"

const Sidebar = () => {
    return (
        <div className='bg-[#003580] px-[25px] h-screen'>
            <div className='px-[15px] py-[30px] flex items-center justify-center border-b-[1px] border-[#EDEDED]/[0.3]'>
                <h1 className='text-white text-[20px] leading-[24px] font-extrabold cursor-pointer'>TakeABreath</h1>
            </div>
            <div className='flex items-center gap-[15px] py-[20px] border-b-[1px] border-[#EDEDED]/[0.3] cursor-pointer'>
                <FaTachometerAlt color='white' />
                <p className='text-[14px] leading-[20px] font-bold text-white'>Dashboard</p>
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> MANAGE</p>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaHotel color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Hotels</p>
                    </div>
                  
                    <FaChevronRight color='white' />
                </div>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaUser color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Users</p>
                    </div>
                    <FaChevronRight color='white' />
                </div>
                   <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaRestroom color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Rooms</p>
                    </div>
                    <FaChevronRight color='white' />
                </div>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaTicketAlt color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Vouchers</p>
                    </div>
                    <FaChevronRight color='white' />
                </div>
            </div>
            <div className='pt-[15px] border-b-[1px] border-[#EDEDED]/[0.3]'>
                <p className='text-[10px] font-extrabold leading-[16px] text-white/[0.4]'> ADDONS</p>
                <div className='flex items-center justify-between gap-[10px] py-[15px] cursor-pointer'>
                    <div className='flex items-center gap-[10px]'>
                        <FaStickyNote color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Pages</p>
                    </div>
               
                </div>
                <div className='flex items-center gap-[10px] py-[15px]  cursor-pointer'>
                    <FaRegChartBar color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Charts</p>
                </div>
                <div className='flex items-center gap-[10px] py-[15px] cursor-pointer'>
                    <FaRegCalendarAlt color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Tables</p>
                </div>
                <div className='flex items-center gap-[10px] py-[15px] cursor-pointer'>
                    <FaRegSun color='white' /> <p className='text-[14px] leading-[20px] font-normal text-white'>Settings</p>
                </div>
            </div>
      
           
        </div>
    )
}

export default Sidebar