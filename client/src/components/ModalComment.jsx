import { Modal, Form, Input, Rate } from "antd";
import { useDispatch } from "react-redux";
import axios from "axios";
import React from "react";
import { addComment } from "../hooks/redux/roomsSlice";
import PropTypes from "prop-types";
import { useToastNotifications } from "../hooks/useToastNotification";

ModalComment.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  selectedInvoice: PropTypes.object.isRequired,
};

function ModalComment({ open, close, selectedInvoice }) {
  const toast = useToastNotifications();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const BE_PORT = import.meta.env.VITE_BE_PORT;
  const hanldeOke = () => {
    form.submit();
  };

  const onFinish = (values) => {
    const { content, ratePoint } = values;
    axios
      .post(`${BE_PORT}/api/hotelList/commentRoom`, {
        content,
        ratePoint,
        roomID: selectedInvoice.roomInfo._id,
        invoiceID: selectedInvoice.invoiceInfo._id,
      })
      .then((res) => res.data)
      .then((data) => {
        toast.showSuccess(data.message);
        dispatch(addComment(data.comment));
        close();
      })
      .catch((err) => {
        console.log(err);
        toast.showError(err.response?.data?.message || "Đánh giá thất bại");
      });
  };

  return (
    <Modal
      title={<h3> Khách sạn {selectedInvoice.hotelInfo?.hotelName ?? ""}</h3>}
      open={open}
      onCancel={close}
      okText="Xác nhận"
      cancelText="Trở lại"
      onOk={hanldeOke}
    >
      <>
        <h4>Đánh giá phòng {selectedInvoice.roomInfo?.roomName}</h4>
        <Form onFinish={onFinish} form={form}>
          <Form.Item label="Số sao" name={"ratePoint"}>
            <Rate />
          </Form.Item>
          <Form.Item label="Chi tiết đánh giá" name={"content"}>
            <Input.TextArea maxLength={100} />
          </Form.Item>
        </Form>
      </>
    </Modal>
  );
}

export default ModalComment;
