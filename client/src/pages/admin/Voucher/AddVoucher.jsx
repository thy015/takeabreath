import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Select } from "antd";
import axios from "axios";
import moment from "moment";

const { RangePicker } = DatePicker;

const ModalAdd = ({ visible, onCancel, onOk, form, header }) => {
  const [owners, setOwners] = useState([]);
  const BE_PORT=import.meta.env.VITE_BE_PORT
  const disableDay = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const fetchOwners = async () => {
    try {
      const response = await axios.get(`${BE_PORT}/api/auth/owner`);
      setOwners(response.data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchOwners();
    }
  }, [visible]);

  return (
    <Modal visible={visible} onCancel={onCancel} footer={null}>
      <Form form={form} onFinish={onOk} layout="vertical">
        <h1 className="text-xl font-bold text-blue-900 text-center">{header}</h1>

        <Form.Item label="Mã Voucher" name="code">
          <Input placeholder="Mặc định các kí tự đầu của tên Vou" />
        </Form.Item>

        <Form.Item
          label="Tên Voucher"
          name="voucherName"
          rules={[{ required: true, message: "Vui lòng nhập tên Voucher" }]}
        >
          <Input placeholder="Tên Voucher" />
        </Form.Item>

        <Form.Item
          label="Chiết khấu (%)"
          name="discount"
          rules={[{ required: true, message: "Vui lòng nhập % giảm giá" }]}
        >
          <Input type="number" min={1} max={50} placeholder="1" />
        </Form.Item>

        <Form.Item
          label="Thời gian hiệu lực"
          name="dates"
          rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
        >
          <RangePicker
            className="w-full"
            placeholder={["Ngày bắt đầu", "Ngày hết hạn"]}
            disabledDate={disableDay}
            format="DD-MM-YYYY"  
          />
        </Form.Item>

        <Form.Item label="Chọn Owner" name="ownerJoined">
          <Select
            mode="multiple"
            placeholder="Chọn các Owner"
            options={owners.map((owner) => ({
              label: owner.ownerName,
              value: owner._id,
            }))}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 23 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="danger"
              htmlType="submit"
              className="bg-blue-800 hover:bg-blue-500 text-white"
            >
              {header}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAdd;
