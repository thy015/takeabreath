import React from 'react'
import SideBar from './SideBar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
function OwnerLayout() {
    return (
        <div className='flex'>
            <div className="basis-[20%] h-[100vh]">
                <SideBar />
            </div>
            <div className="basis-[100%] border overflow-scroll h-[100vh]">
                <Navbar />
                <Outlet />
              
            </div>
        </div>
    )
}

export default OwnerLayout