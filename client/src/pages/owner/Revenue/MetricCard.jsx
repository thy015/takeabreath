import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const MetricCard = ({ title, value, linkText, icon,link }) => {
  return (
    <div className="bg-[#003580] metric-card  rounded-[8px] p-[20px] shadow-[0px_2x_4px_rgba(0,0,0,0.1)]">
      <div className="metric-header flex justify-between">
        <span className="metric-title text-white">{title}</span>
      </div>
      <div className="metric-value text-white text-[24px] font-bold mb-[5px] text-left">{value}</div>
      <div className="metric-footer flex justify-between">
        <a href={link} className="metric-link text-white" >{linkText}</a>
        <span><FontAwesomeIcon icon={icon} className='text-white'/> </span>
      </div>

    </div>
  );
};

export default MetricCard;