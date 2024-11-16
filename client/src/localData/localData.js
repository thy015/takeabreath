import { useTranslation } from "react-i18next";
import {useGet} from "../hooks/hooks";

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
      imgSrc: "https://little-clogs-holidays.co.uk/wp-content/uploads/2019/03/BunkHouse-4-Guest-House-Hotel-1024x677.jpg",
    },
    {
      title: t('Business'),
      text: "This is card number 5",
      imgSrc: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/290145117.jpg?k=2fd87a5e57416941a051a85c210604e4dd7d28364319ebf7ec15982b698f2515&o=&hp=1",
    },
    {
      title: t('Dorm'),
      text: "This is card number 5",
      imgSrc: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/477223988.jpg?k=f6178acde80bd18390ecfac62963a20994a796faf8b3157ad92bdc3e882cc035&o=&hp=1",
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

export const pressReleasedData=()=>{
  const {t}=useTranslation()
  return[
    {
      imgLink:'https://wallpapers.com/images/hd/hotels-in-milan-e5sq32idgh92ijfh.jpg',
      imgAlt:'topic1',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-1-press-released'),
      describe:t('describe-topic-1-press-released')
    },
    {
      imgLink:'https://elquarto.com/blog/wp-content/uploads/2020/12/Hotel-maldivas-1.jpg',
      imgAlt:'topic2',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-2-press-released'),
      describe:t('describe-topic-2-press-released')
    },
    {
      imgLink:'https://img.freepik.com/free-photo/view-luxurious-hotel-hallway_23-2150683497.jpg',
      imgAlt:'topic3',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-3-press-released'),
      describe:t('describe-topic-3-press-released')
    },
    {
      imgLink:'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE2OTQzNzMyMjU2MDgxNDk4MQ%3D%3D/original/408cb246-5c21-4d64-a940-d279d95c6187.jpeg?im_w=1200',
      imgAlt:'topic4',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-1-press-released'),
      describe:t('describe-topic-1-press-released')
    },
  ]
}
export const ourAchievementsData=()=>{
  const {t}=useTranslation()
  return [
    {
      imgLink:'https://thevendry.com/cdn-cgi/image/height=1920,width=1920,fit=contain,metadata=none/https://s3.us-east-1.amazonaws.com/uploads.thevendry.co/24983/1670338672844_Be_Fireside_at_Hotel_Valencia_Santana_Row.jpg',
      imgAlt:'topic1',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-1-our-achievements'),
    },
    {
      imgLink:'https://news.airbnb.com/wp-content/uploads/sites/4/2021/07/2008_March@2X.jpg?fit=616%2C616&resize=616%2C616',
      imgAlt:'topic2',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-2-our-achievements'),
    },
    {
      imgLink:'https://symphony.cdn.tambourine.com/hotel-vandivort/media/hvandivort-rooms-thequeens-6205952de75a2.webp',
      imgAlt:'topic3',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-3-our-achievements'),
    },
    {
      imgLink:'/img/TAB.png',
      imgAlt:'topic4',
      dateReleased:'JANUARY 26,2024',
      title:t('title-topic-4-our-achievements'),
    },
  ]
}

