export interface Comment {
    _id: string;
    userId: string;
    date: Date; 
    text: string;
    postId: string;
}