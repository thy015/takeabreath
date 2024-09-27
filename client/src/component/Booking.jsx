import React, { useState, useEffect } from "react";
import {
  Input,
  DatePicker,
  Dropdown,
  Button,
  Row,
  Col,
  Alert,
  Spin,
  Menu,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCount, useGet } from "../hooks/hooks";

const { RangePicker } = DatePicker;

const Booking = () => {
  // date picker
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");

  dayjs.extend(customParseFormat);
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDayStart(dates[0].format("YYYY-MM-DD"));
      setDayEnd(dates[1].format("YYYY-MM-DD"));
    } else {
      setDayStart(null);
      setDayEnd(null);
    }
  };
  // for the person
  const [aCount, aIncrement, aDecrement] = useCount(0);
  const [cCount, cIncrement, cDecrement] = useCount(0);
  const items = [
    {
      label: (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span>Adults</span>
            <div className="flex items-center">
              <Button
                onClick={aDecrement}
                size="small"
                className="mr-2"
                disabled={aCount === 0}
              >
                -
              </Button>
              <span>{aCount}</span>
              <Button onClick={aIncrement} size="small" className="ml-2">
                +
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "0",
    },
    {
      label: (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="mr-4">Childrens</span>
            <div className="flex items-center">
              <Button
                onClick={cDecrement}
                size="small"
                className="mr-2"
                disabled={cCount === 0}
              >
                -
              </Button>
              <span>{cCount}</span>
              <Button onClick={cIncrement} size="small" className="ml-2">
                +
              </Button>
            </div>
          </div>
        </div>
      ),
      key: "1",
    },
  ];
  // place to go
  const [selectedCity, setSelectedCity] = useState(""); //user select
  const [showCities, setShowCities] = useState(false); //menu display
  const [filteredCities, setFilteredCities] = useState([]);

  const { data, error, loading } = useGet(
    "http://localhost:4000/api/hotelList/hotel"
  );
  useEffect(() => {
    if (data && selectedCity) {
      const filteredCity = Array.from(new Set(data
        .map((hotel) => hotel.city)
        .filter((city) =>
          city.toLowerCase().includes(selectedCity.toLowerCase())))
        ).slice(0,5)
      setFilteredCities(filteredCity);
    } else if (data) {
      //no input yet, show all
      const allCities = Array.from(new Set(data.map((h) => h.city))).slice(0, 5);
      setFilteredCities(allCities);
    } else {
      setFilteredCities([]);
    }
  }, [selectedCity, data]);

  // const citiesData = data ? [...new Set(data.map((hotel) => hotel.city))] : [];

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCities(false);
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    setShowCities(true);
  };
  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
          className={'mt-12'}
        message="Error"
        description="Failed to load properties."
        type="error"
        showIcon
      />
    );
  }

  if (!data || data.length === 0) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }

  return (
    <div
      className="flex w-[60%] 
     bg-white border-4 border-yellow-400 rounded-lg 
     overflow-hidden h-20 items-center shadow-md"
    >
      <Row gutter={0} className="w-full items-center">
        <Col span={6}>
          <Dropdown
            menu={{
              items: filteredCities.map((city, index) => ({
                key: index,
                label: <div onClick={() => handleCitySelect(city)}>{city}</div>,
              })),
            }}
            trigger={["click"]}
            open={showCities}
            onOpenChange={(flag) => setShowCities(flag)}
          >
            <Input
              placeholder="Where you want to go?"
              prefix={<img src="/icon/double-bed.png" alt="Bed Icon" />}
              className="rounded-none h-16"
              bordered={false}
              value={selectedCity}
              onChange={handleCitySearch}
            />
          </Dropdown>
        </Col>
        <Col span={8}>
          <RangePicker
            suffixIcon={<CalendarOutlined />}
            disabledDate={disabledDate}
            onChange={handleDateChange}
            className="rounded-none h-20 w-full"
            bordered={false}
          />
        </Col>
        <Col span={6}>
          <Dropdown
            menu={{
              items
            }}
            trigger={["click"]}
            arrow
            placement="bottomRight"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-20 w-full rounded-none justify-center flex items-center">
              {aCount + cCount} People
            </div>
          </Dropdown>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            className="h-20 w-full rounded-none text-[18px]"
          >
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Booking;
