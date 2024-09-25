import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const HotelDisplay_HotelTab = () => {
  return (
    <div className="w-full">
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Overview" key="1">
          <div>Hotel overview content goes here.</div>
        </TabPane>
        <TabPane tab="Info & prices" key="2">
          <div>Info and prices content goes here.</div>
        </TabPane>
        <TabPane tab="Facilities" key="3">
          <div>Facilities content goes here.</div>
        </TabPane>
        <TabPane tab="Policies" key="4">
          <div>Policies content goes here.</div>
        </TabPane>
        <TabPane tab="The fine print" key="5">
          <div>The fine print content goes here.</div>
        </TabPane>
        <TabPane tab="Guest reviews (78)" key="6">
          <div>Guest reviews content goes here.</div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HotelDisplay_HotelTab;
