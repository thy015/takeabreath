import { useTranslation } from "react-i18next";

export const cardData = ()=>{
  const {t}=useTranslation()
  return [
    {
      title: t('Hotel'),
      text: "This is card number 1",
      imgSrc: "https://th.bing.com/th/id/R.286b917dbac88394a863dd814ee19bda?rik=twiYWEn5m8hQ2A&pid=ImgRaw&r=0",
    },
    {
      title: t('Resort'),
      text: "This is card number 2",
      imgSrc: "https://images7.alphacoders.com/345/345182.jpg",
    },
    {
      title: t('Apartment'),
      text: "This is card number 3",
      imgSrc: "https://th.bing.com/th/id/R.501ec14f760f423a6275470a87a469fa?rik=%2b2GnTEALeJ9jgw&pid=ImgRaw&r=0",
    },
    {
      title: t('Villa'),
      text: "This is card number 4",
      imgSrc: "https://th.bing.com/th/id/OIP.O9nIGE4tMlRXgNs7GmFFLgHaE8?rs=1&pid=ImgDetMain",
    },
    {
      title: t('Cabin'),
      text: "This is card number 5",
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      title: t('Cottage'),
      text: "This is card number 5",
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      title: t('Glamping'),
      text: "This is card number 5",
      imgSrc: "https://via.placeholder.com/150",
    },
    {
      title: t('Guest House'),
      text: "This is card number 5",
      imgSrc: "https://via.placeholder.com/150",
    },
  ];
}
// footer
export const footerData = ()=>{
  const {t}=useTranslation()
  return[
 
  {
    title:t('Our New Project'),
    props:[
      t('Houses'),t('Rooms'),t('Flats'),t('Villas')
    ]
  },
  {
    title:t('Company'),
    props:[
      t('How we work'),t('Our location'),t('Security'),t('Policies')
    ]
  },
  {
    title:t('Movement'),
    props:[
      t('Donations Project'),t('Public Relations'),t('Support Us'),t('Renting')
    ]
  },
  {
    title:t('Help'),
    props:[
      t('Contact Us'),t('FAQ'),t('Privacy'),t('Blogs')
    ]
  },
]
}


