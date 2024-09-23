import React from 'react';
import { Button, notification } from 'antd';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCircleCheck,faCircleXmark} from '@fortawesome/free-solid-svg-icons'
export const openNotification = (status,message,description) => {
  notification.open({
    message: (<div className= 'font-bold text-[20px]' style={{color:status ?"green" : "red"}} >{message}</div>),
    description:(<div className= "text-[15px]" >{description}</div>),
    onClick: () => {
      console.log('Notification Clicked!');
    },
    icon: (
      <FontAwesomeIcon icon={status===true ?faCircleCheck:faCircleXmark} style={{color:status===true ?"green":"red", marginTop:"5px"}}/>
    ),
     duration: 2,
  });
};

