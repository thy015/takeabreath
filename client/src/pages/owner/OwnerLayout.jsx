import React, { useContext, useEffect, useState } from 'react'
import SideBar from './SideBar'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive';
import { AuthContext } from '../../hooks/auth.context';
import { openNotification } from '../../hooks/notification';
function OwnerLayout() {
    const { auth } = useContext(AuthContext)
    const navigate = useNavigate()
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const [isMenu, setIsMenu] = useState(isMobile);
    // useEffect(() => {
    //     if (auth.isAuthenticated) {
    //         if (auth.user.role !== "owner") {
    //             openNotification(false, "Bạn không có quyền truy cập", "")
    //             navigate("/")
    //         }
    //     }
    //
    // }, [auth])
    // useEffect(() => {
    //     setIsMenu(isMobile)
    // }, [isMobile])
    // console.log("[isMenuOpen]", isMenu)

    return (
        <div className='flex'>

            <div className={`h-auto ${isMenu ? 'h-0 md:h-auto hidden' : 'basis-[20%] h-full'}`}>
                <SideBar setIsMenuOpen={() => setIsMenu(true)} />
            </div>
            <div className="basis-[100%] border overflow-scroll h-[100vh] w-full">
                <Navbar isMenuOpen={isMenu} setIsMenuOpen={() => setIsMenu(false)} />
                <Outlet />

            </div>
        </div>
    )
}

export default OwnerLayout