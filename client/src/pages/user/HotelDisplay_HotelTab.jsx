import React from "react";
import { Col, Row, Tabs } from "antd";
import HotelDisplay_HotelDetail from "./HotelDisplay_HotelDetail";
import Booking from "../../component/Booking";
import HotelDetail_RoomDisplay from "./HotelDetail_RoomDisplay";
import { useTranslation } from "react-i18next";
const { TabPane } = Tabs;

const HotelDisplay_HotelTab = () => {
  const {t}=useTranslation();
  const tab_titles = [ { key: "1", title: t('overview'), content: <HotelDisplay_HotelDetail></HotelDisplay_HotelDetail>, }, 
    { key: "2", title: t('infor'), content: <HotelDetail_RoomDisplay></HotelDetail_RoomDisplay> }, 
    { key: "3", title: t('facilities'), content: "" }, 
    { key: "4", title: t('policies'), content: "" }, 
    { key: "5", title: t('the fine print'), content: "" }, 
    { key: "6", title: t('guestreview'), content: "" }, ];
  return (
    <Row>
      <Col span={4} />
      <Col span={16}>
        <div>

          <div className="w-full">
            <Tabs defaultActiveKey="1" size="large" tabBarGutter={80} className="flex-center p-2" >
              {tab_titles.map((tab) => (
                <TabPane tab={tab.title} key={tab.key}>
                  {tab.content}
                </TabPane>
              ))}
            </Tabs>
            <h5 className="mt-7 font-afacad font-light text-[25px]"><span className="font-semibold text-[#0B377F]">{t('interested')}? </span>{t('query')}</h5>
            <div className="my-6">
            <Booking tailwind_prop="w-full h-16"></Booking>
          </div>
          </div>
        </div>
      </Col>
      <Col span={4} />
    </Row>
  );
};

export default HotelDisplay_HotelTab;