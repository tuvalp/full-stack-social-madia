import React, { createContext, useContext, useEffect, useState } from "react";
import type { Post } from "../types/Post";
import { useErrorContext } from "./ErrorContext";
import { useUserContext } from "./UsersCotext";
import { PostApiService } from "../Api/PostsApiService";
import { UploadApiService } from "../Api/UploadApiService";


interface PostContextType {
  posts: Post[];
  addPost: (content: string, img?: File) => Promise<void>;
  updatePost: (id: string, content?: string, img?: File | null) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostsByUserId: (userId: string) => Post[];
  getPostById: (id: string) => Post | null;

  editedPost: Post | null;
  setEditedPost: (post: Post | null) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addError } = useErrorContext();
  const { currentUser } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);

  const [editedPost, setEditedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await PostApiService.getAll();
        setPosts(allPosts);
      } catch (err: any) {
        addError(err.error || "Failed to load posts");
      }
    };

    fetchPosts();
  }, []);

  const addPost = async (text: string, img?: File) => {
    if (!text.trim() && !img) return addError("Post cannot be empty");
    if (!currentUser) return addError("You must be logged in to post");
  
    try {
      let imageUrl: string | undefined;
  
      if (img) {
        const uploadedImg = await UploadApiService.img(img);
        imageUrl = uploadedImg?.file.path;
      }
  
      const newPost = await PostApiService.create({
        userId: currentUser._id,
        text: text.trim(),
        createdAt:  new Date(),
        img: imageUrl,
      });
  
      setPosts((prev) => [newPost, ...prev]);
    } catch (err: any) {
      addError(err.error || "Failed to create post");
    }
  };
  
  
  const updatePost = async (id: string, content?: string, img?: File | null) => {
    try {
      let imgPath: string | undefined;
  
      if (img instanceof File) {
        const uploaded = await UploadApiService.img(img);
        imgPath = uploaded?.file.path;
      } else if (img === null) {
        imgPath = ""; // explicitly remove image
      }
  
      if (!content && !imgPath) return;
  
      if (!currentUser) return addError("You must be logged in to update a post");

      const updatedPost = await PostApiService.update(id, {
        ...(content !== undefined ? { text: content } : {}),
        ...(imgPath !== undefined ? { img: imgPath } : {}),
      });
  
      setPosts((prev) =>
        prev.map((post) => (post._id === id ? updatedPost : post))
      );
    } catch (err: any) {
      addError(err?.error || "Failed to update post");
    }
  
    setEditedPost(null);
  };
  
  
  

  const deletePost = async (id: string) => {
    try {
      await PostApiService.delete(id);
      setPosts((prev) => prev.filter((post) => post._id !== id));
    } catch (err: any) {
      addError(err.error || "Failed to delete post");
    }
  };

  const getPostsByUserId = (userId: string) => {
    return posts.filter((post) => post.userId === userId);
  };

  const getPostById = (id: string) => {
    return posts.find((post) => post._id === id) || null;
  };


  return (
    <PostContext.Provider
      value={{
        posts,
        addPost,
        updatePost,
        deletePost,
        getPostsByUserId,
        getPostById,

        editedPost,
        setEditedPost
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = (): PostContextType => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used inside PostProvider");
  }
  return context;
};
