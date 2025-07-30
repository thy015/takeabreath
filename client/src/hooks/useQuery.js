import {useQuery} from "@tanstack/react-query";
import {commentsApis} from "@/apis/booking/comment/comment";

export const useHotelComments = (hotelId) => {
  return useQuery({
    queryKey:['hotel-comments',hotelId],
    queryFn:()=>commentsApis.getHotelComments({hotelId}),
    enabled: !!hotelId
  })
}