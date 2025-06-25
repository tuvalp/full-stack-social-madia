import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UsersCotext";
import type { Comment } from "../../types/Comment";
import { useEffect, useState } from "react";
import type { User } from "../../types/User";
import RemoveModal from "../Modals/RemoveModal";
import { useCommentContext } from "../../contexts/CommentContex";

interface CommentItemProps {
  children: Comment;
}

export default function CommentItem({ children }: CommentItemProps) {
  const { getUserById, currentUser } = useUserContext();
  const navigate = useNavigate();
  const { deleteComment, setEditedComment } = useCommentContext();
  const [user, setUser] = useState<User | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUserById(children.userId);
      setUser(result);
    };
    fetchUser();
  }, [children.userId]);

  return (
    <>
      <div className="w-100 flex flex-col mb-4">
        <div className="flex flex-row items-center dropdown">
          <div className="flex flex-row items-start flex-start">
            {user?.profileImg ? (
              <img
                className="profile-img-xsm mr-3 mt-2 pointer"
                src={`http://localhost:5050${user?.profileImg}`}
                onClick={() => navigate(`/profile/${user?._id}`)}
                alt="Profile"
              />
            ) : (
              <i
                className="fa fa-user-circle h3 mr-3 mt-3 color-gray-500 pointer"
                onClick={() => navigate(`/profile/${user?._id}`)}
              />
            )}
            <div className="flex flex-col bg-gray-200 pt-3 pb-4 pl-4 pr-4 border-radius-medium items-start flex-start">
              <span
                className="text-bold link"
                onClick={() => navigate(`/profile/${user?._id}`)}
              >
                {user?.name ?? "Loading..."}
              </span>
              <span className="text-md mt-1 text-box">{children.text}</span>
            </div>
          </div>
          {children.userId === currentUser?._id && (
            <button
              className="btn btn-icon btn-icon-sm btn-transparent ml-1"
              onClick={() => setShowOptions(!showOptions)}
            >
              <i className="fa fa-ellipsis-v" />
            </button>
          )}
        </div>
      </div>
      {showOptions && (
        <div className="option-modal">
          <div className="option-modal-content w-20">
            <div className="flex flex-row flex-end mb-1">
              <button
                className="btn btn-icon btn-icon-sm"
                onClick={() => setShowOptions(false)}
              >
                <i className="fa fa-close"></i>
              </button>
            </div>
            <div className="flex items-center p-3 rounded-md hover"
            onClick={() => {
              setShowOptions(false);
              setEditedComment(children);
            }}
            >
              <i className="fa-solid fa-pencil"></i>
              <span className="ml-3  text-md ">Edit</span>
            </div>

            <div
              className="flex items-center p-3 rounded-md hover mb-4"
              onClick={() => {
                setShowOptions(false);
                setShowRemoveModal(true);
              }}
            >
              <i className="fa-solid fa-trash color-danger"></i>
              <span className="ml-3  text-md color-danger">Delete</span>
            </div>
          </div>
        </div>
      )}
      {showRemoveModal && (
        <RemoveModal
          title="Are you sure you want to delete this comment?"
          onCancel={() => setShowRemoveModal(false)}
          onConfirm={() => {
            deleteComment(children._id);
            setShowRemoveModal(false);
          }}
        />
      )}
    </>
  );
}
