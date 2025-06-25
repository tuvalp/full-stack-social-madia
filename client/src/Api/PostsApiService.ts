import axios from "axios";
import { BASE_URL } from "./Config";
import type { Post } from "../types/Post";

const ROUTE_URL = `${BASE_URL}/posts`;

export const PostApiService = {
  async getAll(): Promise<Post[]> {
    try {
      const res = await axios.get(ROUTE_URL);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch posts" };
    }
  },

  async create(post: { userId: string; text: string; createdAt: Date, img?: string }): Promise<Post> {
    try {
      const res = await axios.post(ROUTE_URL, post);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to create post" };
    }
  },

  async update(id: string, updated: Partial<Post>): Promise<Post> {
    try {
      const res = await axios.put(`${ROUTE_URL}/${id}`, updated);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to update post" };
    }
  },

  async delete(id: string): Promise<{ message: string }> {
    try {
      const res = await axios.delete(`${ROUTE_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to delete post" };
    }
  },

  async getByUserId(userId: string): Promise<Post[]> {
    try {
      const res = await axios.get(`${ROUTE_URL}/user/${userId}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch posts by user" };
    }
  },

  async getById(id: string): Promise<Post> {
    try {
      const res = await axios.get(`${ROUTE_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Failed to fetch post" };
    }
  },
};
