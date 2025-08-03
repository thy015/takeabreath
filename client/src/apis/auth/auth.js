import { axiosInstance } from "@/lib/axios";

class AuthApis {
  // GET
  async logOut(){
    const res = await axiosInstance.get ("/api/auth/logout", {
      withCredentials: true,
    });
    return res.data;
  }
  //POST
  async registerUser(formData) {
    const res = await axiosInstance.post("/api/auth/signUpCus", formData);
    return res.data;
  }
  async signInUser(formData) {
    const res = await axiosInstance.post("/api/auth/signInCus", formData)
    return res.data;
  }
}
export const authApis = new AuthApis();
