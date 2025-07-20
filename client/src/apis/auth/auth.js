import { axiosInstance } from "../../lib/axios";

class AuthApis {
  //POST
  async registerUser(formData) {
    const res = await axiosInstance.post("/api/auth/signUpCus", formData);
    return res.data;
  }
}
export const authApis = new AuthApis();
