import React from "react";
import {
  OurAchievementsCard,
  PressReleasesCarousel,
} from "../../component/AccomodationCard";
import { pressReleasedData,ourAchievementsData } from "../../localData/localData";
const AboutUs = () => {
  const pressReleasedDataCard = pressReleasedData();
  const ourAchievementsDataCard = ourAchievementsData();
  return (
    <div>
      {/* 1st section */}
      <div className="row g-0 h-[500px]">
        {/* left display */}
        <div className="col-6 h-full flex items-center justify-center flex-col bg-[#917f67]">
          <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
              <div className="relative inline-block">
                <span className="font-lobster absolute text-4xl inset-0 transform translate-x-0.5 translate-y-0.5 ">
                  We believe that travel is not just about reaching a
                  destination...
                </span>
                <span className="font-lobster relative text-4xl text-white ">
                  We believe that travel is not just about reaching a
                  destination...
                </span>
              </div>
              {/* right display */}
              <div className="relative inline-block mt-8">
                <div className="absolute inset-0 bg-black transform -translate-x-2 -translate-y-2"></div>
                <button className="relative bg-white text-black px-6 py-3 border border-black font-semibold flex items-center space-x-2">
                  <span>READ MORE</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-2"></div>
          </div>
        </div>
        <div className="col-6 h-full">
          <img
            className="h-full object-cover"
            src="https://news.airbnb.com/wp-content/uploads/sites/4/2022/09/Newsroom-About.jpg?w=3000"
            alt="gather-around-pic"
          />
        </div>
      </div>
      {/* 2nd section */}
      <div className="h-[350px]">
        <div className="row h-full">
          <div className="col-3"></div>
          <div className="col-6 flex">
            <div className="text-left flex justify-center flex-col">
              <h3 className=" font-poppins">About Us</h3>
              <p className="text-justify">
                TAB was born in 2007 when two hosts welcomed three guests to
                their San Francisco home, and has since grown to over 5 million
                hosts who have welcomed over 2 billion guest arrivals in almost
                every country across the globe. Every day, hosts offer unique
                stays and experiences that make it possible for guests to
                connect with communities in a more authentic way.
              </p>
            </div>
          </div>
          <div className="col-3"></div>
        </div>
      </div>
      {/* 3rd section */}
      <div className="h-[600px] ">
        <div className="row g-0">
          <div className="col-2">
            <img
              src="/icon/punctuation.png"
              className="rotate-180 scale-y-[-1] float-right"
            ></img>
          </div>
          <div className="col-8 p-5">
            <div className="relative flex justify-start pb-4">
              <div className="italic text-5xl font-oswald absolute transform translate-x-1 translate-y-0.5 text-slate-300">
                {" "}
                Press Releases
              </div>
              <div className="italic text-5xl font-oswald relative text-[#20367B] ">
                {" "}
                Press Releases
              </div>
            </div>
            <PressReleasesCarousel
              cardData={pressReleasedDataCard}
            ></PressReleasesCarousel>
          </div>
          <div className="col-2 flex justify-start items-end">
            <img src="/icon/punctuation.png" className="scale-y-[-1]"></img>
          </div>
        </div>
      </div>
      {/* 4th section */}
      <div className="h-[400px] w-full relative">
        <div className="h-full w-full object-cover relative">
          <video
            src="/video/beach-intro.mp4"
            className="object-cover h-full w-full"
            autoPlay
            muted
            loop
          ></video>
          <div className="text-white absolute inset-0 flex flex-col items-start justify-center pl-40">
            <div className="text-5xl mb-4 font-oswald cursor-pointer">
              JOIN US
            </div>
            <div>
              <ul className="flex space-x-5 text-3xl font-oswald">
                <li>
                  Hotels <div>450+</div>
                </li>
                <li>
                  Apartments <div>450+</div>
                </li>
                <li>
                  Villas <div>450+</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* 5th section */}
      <div className="h-[600px] w-full">
        <div className="h-[100px]"></div>
       
        <div className="row">
          <div className="col-1"></div>
          <div className="col-10">
          <div className="flex justify-between pb-4 font-oswald ">
         <div className="text-2xl pl-4"><span className='font-bold '>Our</span> <span>Achievements</span></div> 
         <div className="text-muted cursor-pointer">SEE ALL</div>
        </div>
            <OurAchievementsCard
              cardData={ourAchievementsDataCard}
            ></OurAchievementsCard>
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
