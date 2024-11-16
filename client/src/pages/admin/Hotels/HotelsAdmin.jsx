import React, { useState } from "react";
import { notification, Row, Col, Spin, Alert, Select } from 'antd';
import { useGet } from "../../../hooks/hooks";
import { PropertyCard } from "../../../component/AccommodationCard";
import { PlusOutlined } from '@ant-design/icons';
import { CreateHotel, ModalDelete } from "./CreateHotel";  
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const { Option } = Select;

const PropertyGrid = () => {
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const { data, error, loading } = useGet(`${BE_PORT}/api/hotelList/hotel`);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showDeleteModal = (hotelId) => {
    setHotelToDelete(hotelId);
    setDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setHotelToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`${BE_PORT}/api/hotelList/deleteHotel/${hotelToDelete}`);
      if (response.status === 200 && response.data.message === 'Product deleted successfully') {
        notification.success({
          message: 'Hotel Deleted Successfully',
          description: 'The hotel has been deleted successfully!',
        });
        handleDeleteCancel();
      } else {
        notification.error({
          message: 'Hotel Deletion Failed',
          description: 'Hotel deletion failed!',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Xảy ra lỗi không xác định.";
      notification.error({
        message: 'Hotel Deletion Failed',
        description: errorMessage,
      });
    }
  };

  const displayData = searchTerm
    ? data.filter((property) => 
        property.hotelName && property.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  const sortHotels = (hotels) => {
    return [...hotels].sort((a, b) => {
      switch (sortKey) {
        case 'rate':
          return b.rate - a.rate;
        case 'numberOfRates':
          return b.numberOfRates - a.numberOfRates;
        case 'hotelType':
          return a.hotelType.localeCompare(b.hotelType);
        default:
          return 0;
      }
    });
  };

  const sortedData = sortHotels(displayData);

  if (loading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load properties."
        type="error"
        showIcon
      />
    );
  }

  return (
    <div className="px-[25px] pt-[25px] h-full bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
         Hiển thị {sortedData.length} trên tổng số khách sạn
        </h1>
        <div className="flex space-x-4 items-center">
        <Select
            placeholder="Lọc dữ liệu"
            onChange={(value) => setSortKey(value)}
            style={{ width: 150 ,height:40}}
            className="mb-2.5"
          >
            <Option value="rate">Đánh giá</Option>
            <Option value="numberOfRates">Lượt đánh giá</Option>
            <Option value="hotelType">Loại khách sạn</Option>
          </Select>
          <div className="relative pb-2.5">
            <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3"/>
            <input
              type="text"
              className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
              placeholder="Tìm kiếm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      
        </div>
      </div>
      <Row gutter={[16, 16]} className="mt-4">
        {sortedData.map((property) => (
          <Col key={property._id} xs={24} sm={12} md={6}>
            <PropertyCard
              property={property}
              link_button={`/admin/hotel/${property._id}/rooms`}
              showButton={true}
              showDeleteModal={() => showDeleteModal(property._id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PropertyGrid;
