import { useEffect, useState } from "react";
import { useCommentContext } from "../../contexts/CommentContex";
import { useUserContext } from "../../contexts/UsersCotext";
import { BASE_URL } from "../../Api/Config";

interface CommentItemProps {
  postId: string;
  userId: string;
}

export default function AddComment({ postId, userId }: CommentItemProps) {
  const { addComment, setRefreshKey, editedComment, updateComment } = useCommentContext();
  const [text, setText] = useState("");
  const { currentUser } = useUserContext();

  const handleAddComment = async () => {
    if (editedComment && editedComment.postId === postId) {
      await updateComment(editedComment._id, { text });
    } else {
      await addComment(text, postId, userId);
    }
    setText("");
    setRefreshKey(Math.random());
  };

  useEffect(() => {
    if (editedComment && editedComment.postId === postId) {
      setText(editedComment.text);
    }
  }, [editedComment]);

  return (
    <div className="flex flex-row items-start flex-center mt-1">
      {currentUser?.profileImg ? (
        <img
          className="profile-img-xsm mr-3 mt-2"
          src={`${BASE_URL}${currentUser?.profileImg}`}
          alt="Profile"
        />
      ) : (
        <i className="fa fa-user-circle h2 mr-3 mt-2 color-gray-500" />
      )}
      <div className="input flex-1 mb-4 text-sm">
        <input
          className="text-sm"
          onChange={(e) => setText(e.target.value)}
          value={text}
          type="text"
          placeholder="What's on your mind?"
        />
      </div>
      <button
        className="btn btn-icon btn-icon-sm btn-primary ml-2 mt-1"
        onClick={handleAddComment}
      >
        <i className="fa fa-arrow-right" />
      </button>
    </div>
  );
}
