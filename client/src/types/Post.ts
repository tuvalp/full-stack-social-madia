export interface Post {
    _id: string;
    userId: string;
    createdAt: Date;
    text: string;
    img?: string;
}