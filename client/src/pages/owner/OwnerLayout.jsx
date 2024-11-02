import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'

import { useMediaQuery } from 'react-responsive';
function OwnerLayout() {
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
    const [isMenu, setIsMenu] = useState(isMobile);
    useEffect(() => {
        console.log("[isMobile]",isMobile)
        setIsMenu(isMobile)
    }, [isMobile])
    console.log("[isMenuOpen]", isMenu)
 
    return (
        <div className='flex'>

            <div className={`h-auto ${isMenu ? 'h-0 md:h-auto hidden':'basis-[20%] h-full' }`}>
                <SideBar setIsMenuOpen={()=>setIsMenu(true)} />
            </div>
            <div className="basis-[100%] border overflow-scroll h-[100vh] w-full">
                <Navbar isMenuOpen={isMenu}  setIsMenuOpen={()=>setIsMenu(false)}/>
                <Outlet />

            </div>
        </div>
    )
}

export default OwnerLayout