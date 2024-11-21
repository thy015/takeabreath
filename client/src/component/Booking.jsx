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
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useCount, useGet } from "../hooks/hooks";
import { openNotification } from "../hooks/notification";
import axios from "axios";
import isBetween from 'dayjs/plugin/isBetween';
const { RangePicker } = DatePicker;
import {useDispatch} from 'react-redux'
import { setSearchResult } from "../hooks/redux/searchSlice";
import { setInputDay } from "../hooks/redux/inputDaySlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
const Booking = ({tailwind_prop}) => {
  const {t}=useTranslation()
// onSearchResults
  const dispatch=useDispatch()
  const navigate=useNavigate()
  //day handle
  const [dayStart, setDayStart] = useState("");
  const [dayEnd, setDayEnd] = useState("");

  dayjs.extend(isBetween)
  dayjs.extend(customParseFormat);
  dayjs.extend(utc)
  dayjs.extend(timezone)

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
  const [aCount, aIncrement, aDecrement] = useCount(1);
  const [cCount, cIncrement, cDecrement] = useCount(0);
  const items = [
    {
      label: (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <span >{t('adults')}</span>
              <div className="flex items-center">
                <Button
                    onClick={aDecrement}
                    size="small"
                    className="mr-2 ml-10"
                    disabled={aCount === 1}
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
              <span className="mr-4 ml-1">{t('childrens')}</span>
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
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const { data, error, loading } = useGet(
      `${BE_PORT}/api/hotelList/hotelCities`
  );
  useEffect(() => {
    if (data) {
      const filteredCity = Array.from(new Set(
        data.cities
          .filter((city) =>
              city.toLowerCase().includes(selectedCity.toLowerCase())))
      )
      setFilteredCities(filteredCity);
      console.log(filteredCity)
    } else {
      setFilteredCities([]);
    }
  }, [selectedCity, data]);



  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setShowCities(false);
  };

  const handleCitySearch = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    if (value) {
      setShowCities(true);
  } else {
      setShowCities(false);
  }
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

// handle - passing data

  const handleSearch=async()=> {

    const people = aCount + cCount
    if (!selectedCity || !dayStart || !dayEnd || !people) {
      return openNotification(false, 'Missing information', 'Please fill out all information before searching');
    }

//format before dispatch
    const formattedDayStart = dayjs(dayStart).tz('Asia/Ho_Chi_Minh').format(); // GMT+7
    const formattedDayEnd = dayjs(dayEnd).tz('Asia/Ho_Chi_Minh').format();
    dispatch(setInputDay({
      dayStart: formattedDayStart,
      dayEnd: formattedDayEnd,
      city: selectedCity
    }))
    console.log(formattedDayStart)
    console.log(formattedDayEnd)

    const searchData = {
      city: selectedCity,
      dayStart: formattedDayStart,
      dayEnd: formattedDayEnd,
      people: people
    }
    console.log(searchData)
    try {
      const res = await axios.post(`${BE_PORT}/api/hotelList/query`, searchData);
      console.log(res.data)
      if (res.status === 200 && res.data.hotelData && res.data.roomData && res.data.countRoom) {
        dispatch(setSearchResult({
          hotelData: res.data.hotelData,
          roomData: res.data.roomData,
          countRoom: res.data.countRoom
        }));
        navigate('/booking');
      } else {
        openNotification(false, 'Error', res.data.message);
      }
    } catch (e) {
      console.log(e);
      console.log(e.message + ' E in passing data');
    }
  }
  return (
      <div className={tailwind_prop}>
        <div
            className="
     bg-white border-4 border-yellow-400 rounded-lg
     overflow-hidden items-center shadow-md w-full"
        >
          <Row gutter={0} className="w-full items-center">
            <Col span={6}>
              <Dropdown
                  menu={{
                    items: filteredCities.map((city, index) => ({
                      key: index,
                      label: (
                          <div onClick={() => handleCitySelect(city)} className="w-full">
                            {city}
                          </div>
                      ),
                    })),
                  }}
                  trigger={["click"]}
                  open={showCities}
                  onOpenChange={(flag) => setShowCities(flag)}
                  dropdownRender={(menu) => (
                      <div style={{ maxHeight: "200px", overflowY: "auto" }}>{menu}</div>
                  )}
              >
                <Input
                    placeholder={t('where-you-want-to-go')}
                    prefix={<img src="/icon/double-bed.png" alt="Bed Icon" />}
                    className="rounded-none h-full"
                    variant={false}
                    value={selectedCity}
                    onChange={handleCitySearch}
                />
              </Dropdown>
            </Col>
            <Col span={8}>
              <RangePicker
                  placeholder={[t('check-in'),t('check-out')]}
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  className="rounded-none "
                  variant={false}
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
                <div className="h-full w-full rounded-none justify-center flex items-center">
                  {aCount + cCount} {t('people')}
                </div>
              </Dropdown>
            </Col>
            <Col span={4} className={tailwind_prop}>
              <Button
                  type="primary"
                  onClick={handleSearch}
                  className="h-full w-full rounded-none text-[18px]"
              >
                {t('search')}
              </Button>
            </Col>
          </Row>
        </div>
      </div>
  );
};

export default Booking;