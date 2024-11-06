import React from "react";
import { Col, Row, Tabs } from "antd";
import HotelDisplay_HotelDetail from "./HotelDisplay_HotelDetail";
import Booking from "../../component/Booking";
import HotelDetail_RoomDisplay from "./HotelDetail_RoomDisplay";
import BookingHistory from "./BookingHistory";
const { TabPane } = Tabs;
const BookingHistory_BookingTab = () => {
    const tab_titles = [
        {
            key: "1",
            title: "Booking History",
            content: <BookingHistory></BookingHistory>,
        },
        { key: "2", title: "Your Cancel Request", content: ''},
        { key: "3", title: "Refund Amount", content: "" },
        // { key: "4", title: "Policies", content: "" },

    ];
    return (
        <Row>
            <Col span={4} />
            <Col span={16}>
                    <div className="w-full p-4">
                        <Tabs defaultActiveKey="1" size="large" className='text-center flex-center'>
                            {tab_titles.map((tab) => (
                                <TabPane tab={tab.title} key={tab.key} >
                                    {tab.content}
                                </TabPane>
                            ))}
                        </Tabs>
                    </div>
            </Col>
            <Col span={4} />
        </Row>
    );
};

export default BookingHistory_BookingTab;