import React from 'react';
import PropTypes from "prop-types";

const MetricCard = ({title, value, linkText, link}) => {
  MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType ([PropTypes.string, PropTypes.number]).isRequired,
    linkText: PropTypes.string.isRequired,
    icon: PropTypes.oneOfType ([PropTypes.object, PropTypes.string]).isRequired,
    link: PropTypes.string.isRequired,
  };
  return (
    <div className="bg-[#003580] metric-card  rounded-[8px] p-[20px] shadow-[0px_2x_4px_rgba(0,0,0,0.1)]">
      <div className="metric-header flex justify-between">
        <span className="metric-title text-white">{title}</span>
      </div>
      <div className="metric-value text-white text-[24px] font-bold mb-[5px] text-left">{value}</div>
      <div className="metric-footer flex justify-between">
        <a href={link} className="metric-link text-white">{linkText}</a>
      </div>

    </div>
  );
};

export default MetricCard;