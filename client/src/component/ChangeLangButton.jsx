import { useTranslation } from "react-i18next";

const ChangeLangButton = ({color,underlineColor}) => {
  const hoverEffect =
  `text-${color} text-[20px] cursor-pointer font-afacad transition-colors duration-300 w-8 hover:text-[#c3eaff] hover:scale-105 hover:bg-[#5576B4] hover:rounded-md`;
    
    //translate
    const { t ,i18n} = useTranslation();
    const changeLanguage=(lng)=>{
      i18n.changeLanguage(lng)
    }
  return (
      <>
          <div
              className={i18n.language === "vie" ? "font-bold pr-4" : "pr-4"}
              style={i18n.language === "vie" ? {textDecoration: "underline", textDecorationColor: underlineColor} : {}}
              onClick={() => changeLanguage("vie")}
          >
              <p className={hoverEffect}>{t("VIE")}</p>
          </div>
          <div
              className={
                  i18n.language === "en"
                      ? "font-bold pr-4" : "pr-4"
              }
              style={i18n.language === "en" ? {textDecoration: "underline", textDecorationColor: underlineColor} : {}}
              onClick={() => changeLanguage("en")}
          >
              <p className={hoverEffect}>{t("EN")}</p>
          </div>
      </>
  );
};
export default ChangeLangButton;