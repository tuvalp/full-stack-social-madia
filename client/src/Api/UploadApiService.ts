import axios from "axios";
import { BASE_URL } from "./Config";

const ROUTE_URL = `${BASE_URL}/upload`;

export const UploadApiService = {
  async img(img: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", img); 

    try {
      const res = await axios.post(`${ROUTE_URL}/img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to upload image" };
    }
  },

  async profile(img: File): Promise<any> {
    const formData = new FormData();
    formData.append("image", img); 

    try {
      const res = await axios.post(`${ROUTE_URL}/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to upload profile image" };
    }
  },
};
