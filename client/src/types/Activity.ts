export type ActivityType = "like" | "comment" | "read";

export interface Activity {
  _id: string;
  type: ActivityType;
  actorId: string;
  targetPostId: string;
  targetUserId: string;
  targetComment?: string;
  commentText?: string;
  timestamp: string;
  read?: boolean;
}
