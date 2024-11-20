import React, { useState, useEffect } from 'react';
import { FaRegCalendarMinus, FaEllipsisV } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import {ExportToExcel} from '../../component/ExportToExcel'
import MostBookedRooms from '../../component/MostBookingRooms';
import MostActiveCustomers from '../../component/MostBookedCus';
const Main = () => {
    axios.defaults.withCredentials = true
    const fileName = "BaoCaoDoanhThu";
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [totalDiscountMonth, setTotalDiscountMonth] = useState(0);
    const [totalDiscountYear, setTotalDiscountYear] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [data,setData]=useState([]);
    const BE_PORT=import.meta.env.VITE_BE_PORT
    const fetchOwners = async () => {
        try {
          const response = await axios.get(`${BE_PORT}/api/booking/mostbookRoom`);
          setData(response.data.rooms); 
        } catch (error) {
          console.error("Error fetching owners:", error);
          setData([]);
        }
      };
      
      
    
      useEffect(() => {
        fetchOwners();
      }, []); 
      
const[numb,setNumb]=useState(0);
    const formatToVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    useEffect(() => {
        axios.get(`${BE_PORT}/api/booking/invoicepaid`)
            .then(response => {
                const  data = response.data;
                setNumb(data.length);
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear();
                const previousYear = currentYear - 1;
                const monthlyCurrent = Array(12).fill(0);
                const monthlyPrevious = Array(12).fill(0);
                data.forEach(invoice => {
                    const invoiceDate = new Date(invoice.createDay);
                    const month = invoiceDate.getMonth();
                    const year = invoiceDate.getFullYear();
                    const totalPrice = invoice.guestInfo.totalPrice*0.10;
                    if (year === currentYear) {
                        monthlyCurrent[month] += totalPrice;
                    } else if (year === previousYear) {
                        monthlyPrevious[month] += totalPrice;
                    }
                });
                const chartData = Array.from({ length: 12 }, (v, i) => ({
                    Tháng: new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(currentYear, i)),
                    "Năm Nay": monthlyCurrent[i],
                    "Năm Trước": monthlyPrevious[i],
                }));
                setMonthlyData(chartData); 
                const totalPriceSumMonth = data.reduce((sum, invoice) => {
                    const invoiceDate = new Date(invoice.createDay);
                    return sum + (invoiceDate.getMonth() === currentDate.getMonth() && invoiceDate.getFullYear() === currentYear ? invoice.guestInfo.totalPrice : 0);
                }, 0);

                const totalPriceSumYear = data.reduce((sum, invoice) => {
                    return sum + (new Date(invoice.createDay).getFullYear() === currentYear ? invoice.guestInfo.totalPrice : 0);
                }, 0);

                const totalPriceSum = data.reduce((sum, invoice) => {
                    return sum + invoice.guestInfo.totalPrice;
                }, 0);

                setTotalDiscount(totalPriceSum * 0.10);
                setTotalDiscountMonth(totalPriceSumMonth * 0.10);
                setTotalDiscountYear(totalPriceSumYear * 0.10);
            })
            .catch(error => console.error('Error fetching invoices:', error));
    }, []);
    return (
        <div className='px-[25px] pt-[25px] bg-[#F8F9FC] pb-[40px]'>
            <div className='flex items-center justify-between'>
                <h1 className='text-[28px] leading-[34px] font-normal text-[#5a5c69] cursor-pointer'>Trang Chủ</h1>
                <ExportToExcel apiData={monthlyData} fileName={fileName} />
            </div>
            <div className='grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]'>
       
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#B589DF] text-[11px] leading-[17px] font-bold'>LỢI NHUẬN (THEO THÁNG)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(totalDiscountMonth)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>LỢI NHUẬN (THEO NĂM)</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(totalDiscountYear)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>TỔNG HOA HỒNG ĐẶT PHÒNG</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{formatToVND(totalDiscount)}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
                <div className='h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out'>
                    <div>
                        <h2 className='text-[#1cc88a] text-[11px] leading-[17px] font-bold'>SỐ LƯỢT ĐẶT PHÒNG</h2>
                        <h1 className='text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]'>{numb}</h1>
                    </div>
                    <FaRegCalendarMinus fontSize={28} />
                </div>
            </div>
            <div className='flex mt-[22px] w-full gap-[30px]'>
                <div className='basis-[70%] border bg-white shadow-md cursor-pointer rounded-[4px]'>
                    <div className='bg-[#F8F9FC] flex items-center justify-between py-[15px] px-[20px] border-b-[1px] border-[#EDEDED] mb-[20px]'>
                        <h2 className='text-[#4e73df] text-[16px] leading-[19px] font-bold'>LỢI NHUẬN TỔNG QUAN</h2>
                        <FaEllipsisV color="gray" className='cursor-pointer' />
                    </div>

                    <div className="w-full">
                    <LineChart
    width={1220}
    height={500}
    data={monthlyData} 
    margin={{
        top: 5,
        right: 35,
        left: 35,
        bottom: 5,
    }}
>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="Tháng" />
    <YAxis />
    <Tooltip formatter={(value) => formatToVND(value)} />
    <Legend />
    <Line type="monotone" dataKey="Năm Nay" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu năm hiện tại" />
    <Line type="monotone" dataKey="Năm Trước" stroke="#82ca9d" name="Doanh thu năm trước" />
</LineChart>

                    </div>
                </div>

      
            </div>
            <div className="flex relative bg-none gap-6 mt-8">
  <div className="flex gap-6 bg-none w-full">
    <div className="flex-1 shadow-lg  rounded-lg p-6">
      <MostBookedRooms rooms={data} />
    </div>
    <div className="flex-1 shadow-lg rounded-lg p-6">
      <MostActiveCustomers />
    </div>
  </div>
</div>


        </div>
    );
}

export default Main;
