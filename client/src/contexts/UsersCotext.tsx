import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/User";
import { useErrorContext } from "./ErrorContext";
import { UsersApiService } from "../Api/UsersApiService";
import { UploadApiService } from "../Api/UploadApiService";

interface UserContextType {
  currentUser: User | null;
  register: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUserById: (id: string) => Promise<User | null>;
  updateUser: (
    id: string,
    user: { name?: string; email?: string; password?: string }
  ) => Promise<void>;

  updateProfileImg: (id: string, profileImg: File) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { addError } = useErrorContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const saved = localStorage.getItem("currentUser");
        if (!saved) return;

        const parsed: User = JSON.parse(saved);
        const validatedUser = await UsersApiService.getUser(parsed._id);
        setCurrentUser(validatedUser);
      } catch {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const register = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (!name || !email || !password || !confirmPassword) {
      addError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      addError("Passwords do not match");
      return;
    }

    const regUser = {
      name,
      email,
      password,
      createAt: new Date(),
    };
    

    try {
      const newUser = await UsersApiService.register({ ...regUser });
      setCurrentUser(newUser);
    } catch (err: any) {
      addError(err.error || "Failed to register");
    }
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) {
      addError("Email and password are required");
      return;
    }

    try {
      const user = await UsersApiService.login(email, password);
      setCurrentUser(user);
    } catch (err: any) {
      console.log(err);
      addError(err.error || "Login failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      const user =await UsersApiService.getUser(id);
      return user;
    } catch (err: any) {
      addError(err.error || "Failed to get user");
      return null;

    }
  };

  const updateUser = async (
    id: string,
    user: { name?: string; email?: string; password?: string }
  ) => {
    try {

      const updatedUser = await UsersApiService.updateUser(id, user);
      setCurrentUser(updatedUser);
    } catch (err: any) {
      addError(err.error || "Failed to update user");
    }
  };

  const updateProfileImg = async (id: string, profileImg: File) => {
    try {
      let profileImgUrl: string | undefined;

      const uploadedImg = await UploadApiService.profile(profileImg);
      profileImgUrl = uploadedImg?.file.path;

      if(profileImgUrl) {
        const updatedUser = await UsersApiService.updateUser(id, { profileImg: profileImgUrl });
        setCurrentUser(updatedUser); 
      }

    } catch (err: any) {
      addError(err.error || "Failed to update user");
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, register, login, logout, getUserById, updateUser, updateProfileImg }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used inside UserProvider");
  }
  return context;
};
