import type { Activity } from "../types/Activity";
import { BASE_URL } from "./Config";

const API_URL = `${BASE_URL}/activitys`;

export const ActivityApiService = {
  async getActivitiesByTargetUserId(targetUserId: string): Promise<Activity[]> {
    const response = await fetch(`${API_URL}/${targetUserId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch activities");
    }
    return await response.json();
  },

  async logActivity(activity: Omit<Activity, "_id">): Promise<Activity> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });

    if (!response.ok) {
      throw new Error("Failed to log activity");
    }

    return await response.json();
  },

  async markActivityAsRead(activityId: string): Promise<void> {
    const response = await fetch(`${API_URL}/${activityId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Failed to mark activity as read");
    }
  },
};
