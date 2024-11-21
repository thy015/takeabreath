import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

const MostActiveCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [timeFrame, setTimeFrame] = useState("Tháng"); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BE_PORT=import.meta.env.VITE_BE_PORT
  useEffect(() => {
    axios
      .get(`${BE_PORT}/api/booking/invoicepaid`)
      .then((response) => {
        setCustomers(response.data); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError("Failed to load customer data.");
        setLoading(false);
      });
  }, []);

  const filterByTimeFrame = (bookings) => {
    const now = dayjs();

    return bookings.filter((booking) => {
      const bookingDate = dayjs(booking.date); 
      if (timeFrame === "Ngày") {
        return bookingDate.isSame(now, "Ngày");
      } else if (timeFrame === "Tuần") {
        return bookingDate.isSame(now, "Tuần");
      } else if (timeFrame === "Tháng") {
        return bookingDate.isSame(now, "Tháng");
      }
      return true;
    });
  };

  const getTopCustomers = () => {
    const filteredBookings = filterByTimeFrame(customers);

    const customerCounts = filteredBookings.reduce((acc, booking) => {
      const { cusID, guestInfo } = booking;

      if (acc[cusID]) {
        acc[cusID].count += 1;
      } else {
        acc[cusID] = {
          cusID,
          name: guestInfo.name,
          email: guestInfo.email,
          count: 1,
        };
      }
      return acc;
    }, {});

    return Object.values(customerCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const topCustomers = getTopCustomers();

  return (
    <div className="max-w-xl mt-8">
      <h2 className="text-[28px] leading-[34px] font-normal text-[#5a5c69] text-center">
      Các khách hàng đặt phòng nhiều nhất
      </h2>

      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setTimeFrame("Ngày")}
          className={`px-4 py-2 text-sm rounded ${
            timeFrame === "Ngày" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
         Ngày
        </button>
        <button
          onClick={() => setTimeFrame("Tuần")}
          className={`px-4 py-2 text-sm rounded ${
            timeFrame === "Tuần" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Tuần
        </button>
        <button
          onClick={() => setTimeFrame("Tháng")}
          className={`px-4 py-2 text-sm rounded ${
            timeFrame === "Tháng" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
         Tháng
        </button>
      </div>

      <div className="rounded-lg shadow-lg overflow-hidden">
  <table className="min-w-full">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
          Khách hàng
        </th>
        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
          Số lần đặt
        </th>
      </tr>
    </thead>
    <tbody>
      {topCustomers.map((customer) => (
        <tr key={customer.cusID} className="border-t">
          <td className="px-4 py-2 text-left text-sm text-gray-800">
            <strong>{customer.name}</strong> ({customer.email})
          </td>
          <td className="px-4 py-2 text-left text-sm text-gray-800">
            {customer.count}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default MostActiveCustomers;
