import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'antd'
import { Link } from 'react-router-dom'
import FormCard from '../../../component/FormCard' 
function Card() {
    const[visible,setVisible ] = useState(false)
    return (
        <div className='h-full '>
            <div className='max-w-[170px] text-left p-[20px]'>
                <Link >
                    <Button
                        onClick={() => setVisible(true)}
                        type='primary'
                        icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                        Thêm thẻ
                    </Button>
                </Link>
            </div>
            <FormCard visible={visible} close={()=>setVisible(false)}></FormCard>
        </div>
    )
}

export default Card