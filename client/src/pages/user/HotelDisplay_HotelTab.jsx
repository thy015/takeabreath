import React from "react";
import { Col, Row, Tabs } from "antd";
import HotelDisplay_HotelDetail from "./HotelDisplay_HotelDetail";
import Booking from "../../component/Booking";
const { TabPane } = Tabs;
const HotelDisplay_HotelTab = () => {
  const tab_titles = [
    {
      key: "1",
      title: "Overview",
      content: <HotelDisplay_HotelDetail></HotelDisplay_HotelDetail>,
    },
    { key: "2", title: "Info & prices", content: "" },
    { key: "3", title: "Facilities", content: "" },
    { key: "4", title: "Policies", content: "" },
    { key: "5", title: "The fine print", content: "" },
    { key: "6", title: "Guest reviews (78)", content: "" },
  ];
  return (
    <Row>
      <Col span={4} />
      <Col span={16}>
        <div>
          <div className="my-6">
            <Booking tailwind_prop="w-full h-16"></Booking>
          </div>

          <div className="w-full">
            <Tabs defaultActiveKey="1" size="large" tabBarGutter={80} >
              {tab_titles.map((tab) => (
                <TabPane tab={tab.title} key={tab.key}>
                  {tab.content}
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
      </Col>
      <Col span={4} />
    </Row>
  );
};

export default HotelDisplay_HotelTab;