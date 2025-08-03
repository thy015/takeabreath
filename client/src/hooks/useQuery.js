import {useQuery} from "@tanstack/react-query";
import {commentsApis} from "@/apis/booking/comment/comment";
import {bookingHistoryApis} from "@/apis/booking/history/history";

export const useHotelComments = (hotelId) => {
  return useQuery({
    queryKey:['hotel-comments',hotelId],
    queryFn:()=>commentsApis.getHotelComments({hotelId}),
    enabled: !!hotelId
  })
}

export const useBookingHistory = (userId) => {
  return useQuery({
    queryKey:['bookingHistory',userId],
    queryFn:()=>bookingHistoryApis.getBookingHistory(userId),
    enabled: !!userId,
  })
}