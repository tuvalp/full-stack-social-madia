import type { Post } from "../../types/Post";
import PostItem from "./PostItem";

interface PostItemProps {
  children: Post[];
}

export default function PostList( { children } : PostItemProps) {

  return (
    <div className="flex flex-col flex-start items-start mh-70 scrollable-y">
      {children.map((post) => (
        <PostItem key={post._id}>{post}</PostItem>
      ))}
    </div>
  );
}
