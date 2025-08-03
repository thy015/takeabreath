import {
  Form,
  Input,
  ConfigProvider,
  DatePicker,
  Button,
} from "antd";
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useToastNotifications } from "@/hooks/useToastNotification";
import {ChevronLeft} from "lucide-react";
function AddVoucher() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const toast = useToastNotifications();
  axios.defaults.withCredential = true;
  function generateRandomString(length) {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }
  //Fetch data
  const onFinish = (values) => {
    const dateVoucher = values.date;
    const stringDateStart = dateVoucher[0].format("YYYY/MM/DD");
    const stringDateEnd = dateVoucher[1].format("YYYY/MM/DD");
    const dateStart = new Date(stringDateStart);
    const dateEnd = new Date(stringDateEnd);
    const dateLast = dateEnd.getDate() - dateStart.getDate();
    if (dateEnd.getMonth() == dateStart.getMonth()) {
      if (dateLast < 2) {
        toast.showError("Voucher must be valid for at least 2 days");
        return;
      }
    }
    let code = values.code;
    if (code === "" || !code) {
      code = generateRandomString(5);
    }
    const voucher = {
      voucherName: values.voucherName,
      discount: values.discount,
      dateStart: stringDateStart,
      dateEnd: stringDateEnd,
      code: code,
    };
    axios
      .post(`${BE_PORT}/api/voucher/add-voucher`, voucher)
      .then((res) => res.data)
      .then((data) => {
        toast.showSuccess("Add voucher successful");
        console.log(data);
      })
      .catch((e) => {
        toast.showError(e.response.data.message || "Add voucher failed");
        console.log(e);
      });
  };

  //Form add voucher
  return (
    <div className="my-[10px] mx-[20px] flex flex-col items-center">
      <h2 className="mt-[30px] mb-[50px] font-bold">Add Voucher</h2>
      <ConfigProvider
        theme={{
          token: {
            colorText: "black",
            fontSize: "17px",
            colorTextDescription: "black",
          },
        }}
      >
        <Form
          className="w-full max-w-[600px]" // Use full width with a max limit
          labelCol={{ span: 24 }} // Make labels full width
          wrapperCol={{ span: 24 }} // Make inputs full width
          layout="vertical" // Use vertical layout for better stacking
          onFinish={onFinish}
        >
          <Form.Item
            label="Voucher name"
            name="voucherName"
            rules={[{ required: true, message: "Please input voucher name!" }]}
          >
            <Input
              className="h-10 p-4"
              placeholder="Enter voucher name"
            />
          </Form.Item>

          <Form.Item
            label="Discount"
            name="discount"
            rules={[{ required: true, message: "Please input discount!", min:0,max:50 }]}
          >
            <Input
              className="h-10 p-4"
              placeholder="Enter discount ( Less than 50% )"
            />
          </Form.Item>

          <Form.Item
            label="Date Start & Date End"
            name="date"
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker.RangePicker  className="h-10 p-4"/>
          </Form.Item>

          <Form.Item label="Code" name="code">
            <Input
              maxLength={5}
              className="h-10 p-4"
              placeholder="Please enter code (If not, it will be automatic)"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Link
                to="/owner/vouchers"
                className="mr-[20px] flex items-center"
              >
                <ChevronLeft size={24} className="mr-[5px]" />
                Back
              </Link>
              <Button className="p-[10px]" type="primary" htmlType="submit">
                Add Voucher
              </Button>
            </div>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
}

export default AddVoucher;
