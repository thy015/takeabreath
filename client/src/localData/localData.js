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
      imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd5JYN7tXO6DDtIvWjYvrOKCHwEYQwsT8cWg&s",
    },
    {
      title: t('Cottage'),
      text: "This is card number 5",
      imgSrc: "https://www.bhg.com/thmb/riniwvt-u2Fo4tYIRJWiRhgTIWA=/1764x0/filters:no_upscale():strip_icc()/cottage-home-brick-gate-shrubbery-7e117ecd-f5e2829db0d5485a8f092c274e310fa0.jpg",
    },
    {
      title: t('Glamping'),
      text: "This is card number 5",
      imgSrc: "https://lh7-us.googleusercontent.com/docsz/AD_4nXcGCuXPBVw6zcIjGEQ3uPpBUxByfDhdO1of1UY3FDUPuQSh7LbkJzoDZ_bQFoQulyt7EwVZsqIE0RPHZKK3M3i22hZYKtMDkUzGotcMQQ8l9xOt7dV5JGroVLDN48-BjORPZ02SN5AWkH62FrhaVawQ8cdO?key=l2LitlgDdvTEreyj3YFWzw",
    },
    {
      title: t('Guest House'),
      text: "This is card number 5",
      imgSrc: "https://cdn.discordapp.com/attachments/1296366202309972010/1296366634671280209/6b26b093-1b53-4fb0-98af-8ef72156e1e9.png?ex=6716a443&is=671552c3&hm=c8bfdd5f562e83376b849ebc2becb956453698fe28481c06149ea50d56557456&",
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


