import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Activity, ActivityType } from "../types/Activity";
import { useUserContext } from "./UsersCotext";
import { ActivityApiService } from "../Api/ActivityApiService";

interface ActivityContextType {
  activities: Activity[];
  unreadActivities: Activity[];
  logActivity: (
    type: ActivityType,
    actorId: string,
    targetPostId: string,
    targetUserId: string,
    targetComment?: string,
    commentText?: string
  ) => Promise<void>;
  markActivityAsRead: (activityId: string) => Promise<void>;
  refreshActivities: () => Promise<void>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const [activities, setActivities] = useState<Activity[]>([]);

  const refreshActivities = useCallback(async () => {
    if (!currentUser?._id) return;
    try {
      const result = await ActivityApiService.getActivitiesByTargetUserId(currentUser._id);
      setActivities(result);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    refreshActivities();
  }, [refreshActivities]);

  const unreadActivities = activities.filter((a) => !a.read);

  const logActivity = async (
    type: ActivityType,
    actorId: string,
    targetPostId: string,
    targetUserId: string,
    targetComment?: string,
    commentText?: string
  ) => {
    if (!actorId || !targetUserId || actorId === targetUserId) return;

    const newActivity: Omit<Activity, "_id"> = {
      type,
      actorId,
      targetPostId,
      targetUserId,
      targetComment,
      commentText,
      read: false,
      timestamp: new Date().toISOString(),
    };

    try {
      await ActivityApiService.logActivity(newActivity);
      await refreshActivities();
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
  };

  const markActivityAsRead = async (activityId: string) => {
    try {
      await ActivityApiService.markActivityAsRead(activityId);
      setActivities((prev) =>
        prev.map((a) => (a._id === activityId ? { ...a, read: true } : a))
      );
    } catch (error) {
      console.error("Failed to mark activity as read:", error);
    }
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        unreadActivities,
        logActivity,
        markActivityAsRead,
        refreshActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityContext = (): ActivityContextType => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivityContext must be used within an ActivityProvider");
  }
  return context;
};
