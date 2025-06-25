import axios from "axios";
import { BASE_URL } from "./Config";
import type { Like } from "../types/Like";

const ROUTE_URL = `${BASE_URL}/likes`;

export const LikeApiService = {
  async getByPostId(postId: string): Promise<Like[]> {
    try {
      const res = await axios.get(`${ROUTE_URL}/${postId}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch likes" };
    }
  },

  async toggleLike(postId: string, userId: string): Promise<{ message?: string; like?: Like }> {
    try {
      const res = await axios.post(`${ROUTE_URL}/${postId}`, { userId });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to toggle like" };
    }
  },

  async checkUserLike(postId: string, userId: string): Promise<Like | null> {
    try {
      const res = await axios.get(`${ROUTE_URL}/${postId}/${userId}`);
      return res.data || null;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to check like" };
    }
  },
};
