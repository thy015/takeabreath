import React, { useState } from "react";
import { notification, Row, Col, Spin, Alert, FloatButton } from 'antd';
import { useGet } from "../../../hooks/hooks";
import { PropertyCard } from "../../../component/AccomodationCard";
import { PlusOutlined } from '@ant-design/icons';
import { CreateHotel, ModalDelete } from "./CreateHotel";  
import axios from "axios";
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
const PropertyGrid = () => {
  const { data, error, loading } = useGet("http://localhost:4000/api/hotelList/hotel");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); 
  const [hotelToDelete, setHotelToDelete] = useState(null); 

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
    setHotelToDelete(null); // Reset the hotelToDelete
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/hotelList/deleteHotel/${hotelToDelete}`);
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
      console.error("Error during hotel deletion:", error); 
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Hotel Deletion Failed',
        description: errorMessage,
      });
    }
  };
  
  

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

  if (!data || data.length === 0) {
    return <Alert message="No hotel data found" type="info" showIcon />;
  }

  return (
    <div className="px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
    <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
      Tất cả khách sạn
    </h1>
    <div className="relative pb-2.5">
    <FaSearch className="text-[#9c9c9c]  absolute top-1/4 left-3"/>
      <input
        type="text"
        className="pl-10 bg-[#E7E7E7] h-[40px] text-white outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
        placeholder="Tìm kiếm"
      />
    </div>
  </div>
      <Row gutter={[16, 16]} className="mt-4">
        {data.map((property) => (
          <Col key={property._id} xs={24} sm={12} md={6}>
            <PropertyCard
              property={property}
              link_property={`/hotel/${property._id}`}
              link_button={`/admin/hotel/${property._id}/rooms`}
              edit={`/admin/hotel/${property._id}/updateHotel`}
              showButton={true}
              showDeleteModal={() => showDeleteModal(property._id)} 
            />
          </Col>
        ))}
      </Row>


      <CreateHotel
        visible={isModalVisible}
        handleCancel={handleCancel}
      />

      <ModalDelete
        open={deleteModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default PropertyGrid;
