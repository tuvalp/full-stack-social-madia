import axios from "axios";
import { BASE_URL } from "./Config";
import type { Comment } from "../types/Comment";

const ROUTE_URL = `${BASE_URL}/comments`;

export const CommentApiService = {
  async getByPostId(postId: string): Promise<Comment[]> {
    try {
      const res = await axios.get(`${ROUTE_URL}/${postId}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch comments" };
    }
  },

  async create(comment: Omit<Comment, "_id">): Promise<Comment> {
    try {
      const res = await axios.post(`${ROUTE_URL}/`, comment);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to create comment" };
    }
  },

  // 🔍 Get a specific comment by ID
  async getById(id: string): Promise<Comment> {
    try {
      const res = await axios.get(`${ROUTE_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch comment" };
    }
  },

  async update(id: string, updated: Partial<Comment>): Promise<void> {
    try {
      await axios.put(`${ROUTE_URL}/${id}`, updated);
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to update comment" };
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axios.delete(`${ROUTE_URL}/${id}`);
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to delete comment" };
    }
  },
};
