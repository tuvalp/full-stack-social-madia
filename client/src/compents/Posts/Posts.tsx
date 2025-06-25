
import { usePostContext } from "../../contexts/PostContext";
import AddPost from "./AddPost";
import PostList from "./PostList";

export default function Posts() {
  return (
    <div className="flex flex-col flex-start">
      <AddPost />
      <List />
    </div>
  );
}

const List = () => {
  const { posts } = usePostContext();
  return <PostList>{posts}</PostList>;
};
