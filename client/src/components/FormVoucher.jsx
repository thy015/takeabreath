import {Form, Input, ConfigProvider, DatePicker, Button, InputNumber} from 'antd'
import React from 'react'
import PropTypes from "prop-types";

const FormVoucher = ({record}) => {
  FormVoucher.propTypes = {
    record: PropTypes.shape ({
      voucherName: PropTypes.string,
    }),
  };
  const onFinish = (values) => {
    console.log (values)
  }
  return (
    <div className='my-[10px] mx-[20px] flex flex-col items-center'>
      <ConfigProvider
        theme={{
          token: {
            colorText: "black",
            fontSize: "17px",
            colorTextDescription: "black"
          }
        }}
      >
        <Form

          layout="vertical" // Change to vertical layout
          onFinish={onFinish}
        >
          <Form.Item
            label="Voucher name"
            name="voucherName"
            rules={[
              {
                required: true,
                message: "Please input voucher name!"
              }
            ]}
          >
            <Input className='px-[10px]' placeholder={record.voucherName}/>
          </Form.Item>

          <div className="flex flex-col md:flex-row md:gap-4">
            <Form.Item
              label="Discount"
              name="discount"
              rules={[
                {
                  required: true,
                  message: "Please input discount!"
                }
              ]}
              className="flex-1" // Allow it to grow
            >
              <InputNumber
                min={0} max={50}
                type='number' addonAfter="%"
                className='w-full'
                placeholder='Enter discount (up to 50%)'/>
            </Form.Item>

            <Form.Item
              label="Date Start & End"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Please input date!"
                },
              ]}
              className="flex-1" // Allow it to grow
            >
              <DatePicker.RangePicker className='w-full'/>
            </Form.Item>
          </div>

          <Form.Item
            label="Code"
            name="code"
          >
            <Input
              maxLength={5}
              className='px-[10px]'
              placeholder='Please enter code (If not, it will be automatic)'/>
          </Form.Item>

          <Form.Item>
            <Button
              className='w-full p-[10px]'
              type='primary'
              htmlType='submit'
            >Add Voucher</Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  )
}

export default FormVoucher