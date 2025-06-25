import axios from "axios";
import { BASE_URL } from "./Config";

const ROUTE_URL: string = `${BASE_URL}/users`;

export const UsersApiService = {

  async login(email: string, password: string) {
    try {
      const res = await axios.get(`${ROUTE_URL}/login`, {
        params: { email, password },
      });
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Login failed" };
    }
  },

  async register(user: { name: string; email: string; password: string; createAt: Date;}) {
    try {
      const res = await axios.post(`${ROUTE_URL}/register`, user);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Registration failed" };
    }
  },

  async updateUser(id: string, user: {name?: string;  email?: string; password?: string; profileImg?: string;}) {
    try {
      const res = await axios.put(`${ROUTE_URL}/${id}`, user);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Update failed" };
    }
  },

  async deleteUser(id: string) {
    try {
      const res = await axios.delete(`${ROUTE_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "Delete failed" };
    }
  },

  async getUser(id: string) {
    try {
      const res = await axios.get(`${ROUTE_URL}/${id}`);
      return res.data;
    } catch (err: any) {
      throw err.response?.data || { error: "User fetch failed" };
    }
  },
};
