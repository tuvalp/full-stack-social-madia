import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActivityContext } from "../../contexts/ActivityContext";
import { useUserContext } from "../../contexts/UsersCotext";
import { formatRelativeDate } from "../../utils";
import type { Activity } from "../../types/Activity";
import type { User } from "../../types/User";

export default function AlartDropDown() {
  const { activities, markActivityAsRead } = useActivityContext();
  const { getUserById } = useUserContext();
  const navigate = useNavigate();

  const [users, setUsers] = useState<Record<string, User | null>>({});

  // Fetch all actors
  useEffect(() => {
    const fetchUsers = async () => {
      const map: Record<string, User | null> = {};
      for (const activity of activities) {
        if (!map[activity.actorId]) {
          const user = await getUserById(activity.actorId);
          map[activity.actorId] = user;
        }
      }
      setUsers(map);
    };

    fetchUsers();
  }, [activities]);

  const handleClick = (activityId: string, targetPostId: string) => {
    markActivityAsRead(activityId);
    navigate(`/post/${targetPostId}`);
  };

  return (
    <div className="dropdown-content wp-350 bg-white p-4 border-radius-medium shadow">
      {activities.length === 0 ? (
        <div className="text-center color-gray-500">No activities</div>
      ) : (
        activities.map((activity: Activity) => {
          const actor = users[activity.actorId];
          return (
            <div
              key={activity._id}
              className="flex flex-col mb-2 hover p-3 cursor-pointer"
              onClick={() => handleClick(activity._id, activity.targetPostId)}
            >
              <div className="flex flex-row flex-between items-center">
                <div className="flex flex-row items-center">
                  <i className="fa fa-user-circle h3 mr-3"></i>
                  <div className="flex flex-col">
                    <div>
                      <span className="text-bold text-md mr-2">
                        {actor?.name ?? "Unknown User"}
                      </span>
                      <span className="text-md">
                        {activity.type === "comment"
                          ? "commented on your post"
                          : "liked your post"}
                      </span>
                    </div>
                    <span className="color-gray-500 text-sm">
                      {formatRelativeDate(activity.timestamp)}
                    </span>
                  </div>
                </div>
                {!activity.read && (
                  <div className="bg-primary wp-6 hp-6 border-radius-full"></div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
