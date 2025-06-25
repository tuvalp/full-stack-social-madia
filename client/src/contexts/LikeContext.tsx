import React, { createContext, useContext } from "react";
import { useUserContext } from "./UsersCotext";
import { useErrorContext } from "./ErrorContext";
import { useActivityContext } from "./ActivityContext";
import { LikeApiService } from "../Api/LikesApiService";
import type { Like } from "../types/Like";

interface LikeContextType {
  getLikesByPost: (postId: string) => Promise<Like[]>;
  toggleLike: (postId: string, postOwnerId: string) => Promise<void>;
  checkUserLike: (postId: string) => Promise<boolean>;
}

const LikeContext = createContext<LikeContextType | undefined>(undefined);

export const LikeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUserContext();
  const { addError } = useErrorContext();
  const { logActivity } = useActivityContext();

  const getLikesByPost = async (postId: string): Promise<Like[]> => {
    try {
      return await LikeApiService.getByPostId(postId);
    } catch (err: any) {
      addError(err.error || "Failed to fetch likes");
      return [];
    }
  };

  const checkUserLike = async (postId: string): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const like = await LikeApiService.checkUserLike(postId, currentUser._id);
      return !!like;
    } catch (err: any) {
      addError(err.error || "Failed to check like");
      return false;
    }
  };

  const toggleLike = async (postId: string, postOwnerId: string): Promise<void> => {
    if (!currentUser) {
      addError("You must be logged in to like posts");
      return;
    }

    try {
      const result = await LikeApiService.toggleLike(postId, currentUser._id);
      if (result?.message !== "Like deleted") {
        logActivity("like", currentUser._id, postId, postOwnerId);
      }
    } catch (err: any) {
      addError(err.error || "Failed to toggle like");
    }
  };

  return (
    <LikeContext.Provider
      value={{
        getLikesByPost,
        toggleLike,
        checkUserLike,
      }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLikeContext = (): LikeContextType => {
  const context = useContext(LikeContext);
  if (!context) {
    throw new Error("useLikeContext must be used inside LikeProvider");
  }
  return context;
};
