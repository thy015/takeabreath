import {setAuthData} from "@/store/redux/auth";
import {axiosInstance} from "@/lib/axios";
import Cookies from "js-cookie";

export const rehydrateAuthState = async (dispatch) => {
  const token = Cookies.get('token');
  if (token) {
    try {
      const response = await axiosInstance.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setAuthData({ ...response.data, token }));
    } catch (error) {
      console.error('Failed to verify token:', error);
      Cookies.remove('token');
    }
  }
};