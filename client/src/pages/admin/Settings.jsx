import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../hooks/auth.context";
import axios from "axios";

const Settings = () => {
  const { auth,setAuth } = useContext(AuthContext);
  const [email, setEmail] = useState(null);
  const [adminName, setAdminName] = useState(null);
  const [imgLink, setImgLink] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [admin, setAdmin] = useState(); 
  const BE_PORT = import.meta.env.VITE_BE_PORT;

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${BE_PORT}/api/auth/admin/${auth?.user?.id}`);
      setAdmin(response.data._id); 
      setAdminName(response.data.adminName);
      setEmail(response.data.email);
      setImgLink(response.data.imgLink); 
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  useEffect(() => {
    if (auth?.user?.id) {
      fetchAdmin();
    }
  }, [auth?.user?.id]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await axios.put(`${BE_PORT}/api/auth/admin/${auth?.user?.id}`, {
        email,
        adminName,
        imgLink, 
      });
      setMessage("Cập nhật thành công!");
      fetchAdmin();
      setAuth({
        isAuthenticated: true,
        user: {
          id: admin ?? "",
          email: email ?? "",
          name: adminName ?? "",
          role: "admin",
        }
      })
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Có lỗi xảy ra, vui lòng thử lại!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-5 gap-8 p-8">
        <div className="col-span-5">
          <div className="rounded-sm border border-stroke bg-[#F8F9FC] shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Cài đặt tài khoản
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Địa Chỉ Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      id="emailAddress"
                      placeholder="ehe@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-5.5 mt-2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Tên Người Dùng
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    id="Username"
                    placeholder="ehe"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                </div>

                <div className="mb-5.5 mt-2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="profilePicture"
                  >
                    Ảnh của bạn
                  </label>
                  <input
                    type="url"
                    className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    id="profilePicture"
                    placeholder="Nhập link ảnh"
                    value={imgLink} 
                    onChange={(e) => setImgLink(e.target.value)} 
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="flex justify-center rounded bg-primary text-white py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
              {message && (
                <p className="mt-4 text-center text-red-500">{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
