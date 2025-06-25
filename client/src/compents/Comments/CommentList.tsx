import { useEffect, useState } from "react";
import { useCommentContext } from "../../contexts/CommentContex";
import CommentItem from "./CommentItem";
import type { Comment } from "../../types/Comment";

interface CommentListProps {
  postId: string;
  
}

export default function CommentList({ postId }: CommentListProps) {
  const { getCommentsByPostId, refreshKey } = useCommentContext();
  const [showAll, setShowAll] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const result = await getCommentsByPostId(postId);
      setComments(result);
    };

    fetchComments();
  }, [postId, refreshKey]);

  const visibleComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="flex flex-col flex-1 items-start w-100 flex-start mh-90 scrollable-y">
      {comments.length > 3 && (
        <div className="ml-4 mb-3">
          <span
            className="text-bold link ml-4"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show less" : "Show more comments"}
          </span>
        </div>
      )}

      {visibleComments.map((comment) => (
        <CommentItem key={comment._id}>{comment}</CommentItem>
      ))}
    </div>
  );
}
