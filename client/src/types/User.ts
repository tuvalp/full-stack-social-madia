export interface User {
    _id: string;
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    profileImg?: string;
  }
  