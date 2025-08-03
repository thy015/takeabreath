import {axiosInstance} from "@/lib/axios";

class BookingHistoryApis {
//   GET
  async getBookingHistory(userId){
    try {
      const res = await axiosInstance.get(`/api/booking/bookingHistory/${userId}`);
      console.log('[BOOKING RES DATA]',res.data);
      return res.data;
    }catch(error){
      console.error(error);
      throw error;
    }
  }
}
export const bookingHistoryApis=new BookingHistoryApis();