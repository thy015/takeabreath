import {useTranslation} from "react-i18next";
import React from "react";
import PropTypes from "prop-types";
import {clsx} from "clsx";

const ChangeLangButton = ({color, underlineColor}) => {
  ChangeLangButton.propTypes = {
    color:PropTypes.string,
    underlineColor:PropTypes.string,
  }
  const hoverEffect =clsx(
    `text-${color} text-center text-[20px] cursor-pointer font-afacad transition-colors duration-300 w-8 hover:text-black hover:scale-105 hover:bg-gray-400 hover:rounded-md`);

  //translate
  const {t, i18n} = useTranslation ();
  const changeLanguage = (lng) => {
    i18n.changeLanguage (lng)
  }
  return (
    <>
      <div
        className={i18n.language === "vie" ? "font-bold pr-4" : "pr-4"}
        style={i18n.language === "vie" ? {textDecoration: "underline", textDecorationColor: underlineColor} : {}}
        onClick={() => changeLanguage ("vie")}
      >
        <p className={hoverEffect}>{t ("VIE")}</p>
      </div>
      <div
        className={
          i18n.language === "en"
            ? "font-bold pr-4" : "pr-4"
        }
        style={i18n.language === "en" ? {textDecoration: "underline", textDecorationColor: underlineColor} : {}}
        onClick={() => changeLanguage ("en")}
      >
        <p className={hoverEffect}>{t ("EN")}</p>
      </div>
    </>
  );
};
export default ChangeLangButton;