import React from "react";
import { Footnote, PageBottom, Tailwind } from "@onedoc/react-print";
export const QRInvoice = ({invoice}) => {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString('vi-VN', {
    weekday: 'long', 
    year: 'numeric',
    month: 'long',    
    day: 'numeric',
  });
  return (
    <Tailwind 
      config={{
        theme: {
          extend: {},
        },
      }}
    >
      <div>
        <div className="flex justify-between items-end pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Hoá Đơn: #{invoice._id.slice(-6)}</h1>
            <p className="text-xs">{date}</p>
          </div>
          <img 
  src="https://res.cloudinary.com/dl5epe8p1/image/upload/v1732018295/bwzuhmpsb2ieo4zuji60.png"
  style={{ width: '100px', height: 'auto' }}
/>
        </div>

        <div className="text-right">
          <p className="p-0 mb-1">
            <b>Take A Breath</b>
          </p>
          <p className="p-0 mb-1">666 Sư Vạn Hạnh,</p>
          <p className="p-0 mb-1">Phường 13,</p>
          <p className="p-0 mb-1">Quận 10,</p>
          <p className="p-0 mb-1">Thành phố Hồ Chí Minh</p>
        </div>

        <div className="h-px bg-gray-300 my-4" />

        <div>
          <p className="p-0 mb-1">
            <b>Hóa đơn tới:</b>
          </p>
          <p className="p-0 mb-1">Ngài: {invoice.guestInfo.name}</p>
          <p className="p-0 mb-1">Email: {invoice.guestInfo.email}</p>
          <p className="p-0 mb-1">SDT: {invoice.guestInfo.phone}</p>
          <p className="p-0 mb-1">CCCD: {invoice.guestInfo.idenCard}</p>
        </div>

        <div className="h-px bg-gray-300 my-4" />

        <p className="p-0 leading-5">
         Hóa đơn này dựa trên thông tin quý khách đã đặt vào {new Date(invoice.createDay).toLocaleDateString('vi-VN')}
          <Footnote>Dựa trên thời gian thật.</Footnote>
        </p>

        <table className="w-full my-12">
          <tr className="border-b border-gray-300">
          <th className="text-left font-bold py-2">Phòng</th>
          <th className="text-left font-bold py-2">Tổng Số Phòng</th>
            <th className="text-right font-bold py-2">Ngày Nhận Phòng</th>
            <th className="text-right font-bold py-2">Ngày Trả Phòng</th>
            <th className="text-right font-bold py-2">Tổng Tiền</th>
          </tr>
          <tr>
            <td className="py-2">{invoice.roomID.roomName}</td>
            <td className="py-2 text-center">{invoice.guestInfo.totalRoom}</td>
            <td className="py-2 text-center">{new Date(invoice.guestInfo.checkInDay).toLocaleDateString('vi-VN')}</td>
            <td className="py-2 text-center">{new Date(invoice.guestInfo.checkOutDay).toLocaleDateString('vi-VN')}</td>
            <td className="py-2 text-center">{invoice.guestInfo.totalPrice.toLocaleString()} VND</td>
          </tr>
          {/* <tr>
            <td className="py-2 font-bold">Subtotal</td>
            <td className="py-2 text-right font-bold">$1,750.00</td>
          </tr>
          <tr>
            <td className="py-2">Discount</td>
            <td className="py-2 text-right">-$50.00</td>
          </tr>
          <tr>
            <td className="py-2 font-bold">Total</td>
            <td className="py-2 text-right font-bold">$1,700.00</td>
          </tr> */}
        </table>

        <PageBottom>Cảm ơn quý khách hàng rất nhiều! Mọi thắc mắc vui lòng liên hệ thymai.1510@gmail.com.</PageBottom>
      </div>
    </Tailwind>
  );
};
