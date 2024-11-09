import React from "react";
import { Col, Row, Tabs } from "antd";
import BookingHistory from "./BookingHistory";
import YourCancelRequest from "./YourCancelRequest";
const { TabPane } = Tabs;
const BookingHistory_BookingTab = () => {
    const tab_titles = [
        {
            key: "1",
            title: "Booking History",
            content: <BookingHistory></BookingHistory>,
        },
        { key: "2", title: "Your Cancel Request", content:<YourCancelRequest></YourCancelRequest>},
        { key: "3", title: "Refund Amount", content: "" },
        // { key: "4", title: "Policies", content: "" },

    ];
    return (
        <Row>
            <Col span={4} />
            <Col span={16}>
                    <div className="w-full p-4">
                        <Tabs defaultActiveKey="1" size="large" className='text-center flex-center w-full'>
                            {tab_titles.map((tab) => (
                                <TabPane tab={tab.title} key={tab.key} style={{ width: '100%' }} >
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