import React, { createContext, useContext, useState } from "react";
import type { Comment } from "../types/Comment";
import { useUserContext } from "./UsersCotext";
import { useErrorContext } from "./ErrorContext";
import { useActivityContext } from "./ActivityContext";
import { CommentApiService } from "../Api/CommentApiService";

interface CommentContextType {
  addComment: (text: string, postId: string, userId: string) => Promise<void>;
  updateComment: (id: string, updated: Partial<Comment>) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  getCommentsByPostId: (postId: string) => Promise<Comment[]>;

  refreshKey: number;
  setRefreshKey: (key: number) => void;  

  editedComment: Comment | null;
  setEditedComment: (comment: Comment | null) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const { logActivity } = useActivityContext();
  const { addError } = useErrorContext();

  const [refreshKey, setRefreshKey] = useState(0);

  const [editedComment, setEditedComment] = useState<Comment | null>(null);


  const addComment = async (text: string, postId: string, postOwnerId: string) => {
    if (!text.trim()) return addError("Comment cannot be empty");
    if (!currentUser) return addError("You must be logged in to comment");

    try {
      const newComment = await CommentApiService.create({
        userId: currentUser._id,
        postId,
        text: text.trim(),
        date: new Date(),
      });
      getCommentsByPostId(postId);
      logActivity("comment", currentUser._id, postId, postOwnerId, newComment._id);
    } catch (err: any) {
      addError(err.error || "Failed to add comment");
    }
  };

  const updateComment = async (id: string, updated: Partial<Comment>) => {
    try {
      await CommentApiService.update(id, updated);
      setRefreshKey(refreshKey + 1);
      setEditedComment(null);
    } catch (err: any) {
      addError(err.error || "Failed to update comment");
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await CommentApiService.delete(id);
      setRefreshKey(refreshKey + 1);
    } catch (err: any) {
      addError(err.error || "Failed to delete comment");
    }
  };

  const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    try {
      return await CommentApiService.getByPostId(postId);
    } catch (err: any) {
      addError(err.error || "Failed to fetch comments");
      return [];
    }
  };

  return (
    <CommentContext.Provider
      value={{
        addComment,
        updateComment,
        deleteComment,
        getCommentsByPostId,

        refreshKey,
        setRefreshKey,

        editedComment,
        setEditedComment
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = (): CommentContextType => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used inside CommentProvider");
  }
  return context;
};
