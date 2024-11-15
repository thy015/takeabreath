import React, { useState, useEffect } from "react";
import { Spin, Alert, Table, Tag, Modal, notification, Form, Input, DatePicker, Button, Space } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import { FaSearch } from "react-icons/fa";
const ModalAdd = ({ visible, onCancel, onOk, form, header }) => {
    return (
      <Modal
        visible={visible}
        onCancel={onCancel}
        footer={null}
      >
        <Form form={form} onFinish={onOk} layout="vertical">
        <h1 className="text-xl font-bold text-blue-900 text-center">{header}</h1>
        <Form.Item
            label="Mã Voucher"
            name="code"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Voucher"
            name="voucherName"
            rules={[{ required: true, message: "Please enter the voucher name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Chiết khấu (%)"
            name="discount"
            rules={[{ required: true, message: "Please enter the discount" }]}
          >
            <Input type="number" min={1} max={50} />
          </Form.Item>
          <Form.Item
            label="Thời gian hiệu lực"
            name="dates"
            rules={[{ required: true, message: "Please select the date range" }]}
          >
            <DatePicker.RangePicker className="w-full" placeholder={["Ngày bắt đầu", "Ngày hết hạn"]} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 23 }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
  export default ModalAdd



  