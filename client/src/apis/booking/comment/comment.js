import {axiosInstance} from "@/lib/axios";

class CommentApis {
//   POST
  async getHotelComments({hotelId}){
    try{
      const res=await axiosInstance.post(`/api/hotelList/comment/${hotelId}`, {hotelId})
      console.log("API comments:", res.data);
      return res.data
    }catch(err){
      console.error(err)
      throw err;
    }
  }
}
export const commentsApis= new CommentApis()