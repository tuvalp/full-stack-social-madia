import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCommentContext } from "../../contexts/CommentContex";
import { useLikeContext } from "../../contexts/LikeContext";
import { useUserContext } from "../../contexts/UsersCotext";
import { usePostContext } from "../../contexts/PostContext";
import type { Post } from "../../types/Post";
import type { User } from "../../types/User";
import type { Comment } from "../../types/Comment";
import type { Like } from "../../types/Like";
import { formatRelativeDate } from "../../utils";
import Comments from "../Comments/Comments";
import ImgModal from "../Modals/ImgModal";
import RemoveModal from "../Modals/RemoveModal";

interface PostItemProps {
  children?: Post;
}

export default function PostItem({ children }: PostItemProps) {
  const { getUserById, currentUser } = useUserContext();
  const { toggleLike, checkUserLike, getLikesByPost } = useLikeContext();
  const { getCommentsByPostId } = useCommentContext();
  const { getPostById, setEditedPost, deletePost } = usePostContext();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const postIdFromParams = useParams().id ?? "";
  const post = useMemo(
    () => children ?? getPostById(postIdFromParams),
    [children, postIdFromParams]
  );

  const postId = post?._id;
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [liked, setLiked] = useState(false);
  const [likeUserNames, setLikeUserNames] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (!post?.userId) return;
    getUserById(post.userId).then(setUser);
  }, [post?.userId]);

  useEffect(() => {
    if (!postId) return;
    getCommentsByPostId(postId).then(setComments);
  }, [postId]);

  useEffect(() => {
    if (!postId) return;

    const fetchLikeData = async () => {
      const [likeList, isLiked] = await Promise.all([
        getLikesByPost(postId),
        checkUserLike(postId),
      ]);
      setLikes(likeList);
      setLiked(isLiked);

      // Fetch all usernames
      const uniqueUserIds = Array.from(
        new Set(likeList.map((like) => like.userId))
      );
      const nameEntries = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          const user = await getUserById(userId);
          return [userId, user?.name ?? "Unknown"];
        })
      );

      setLikeUserNames(Object.fromEntries(nameEntries));
    };

    fetchLikeData();
  }, [postId]);

  const handleToggleLike = async () => {
    if (!postId || !post?.userId) return;

    await toggleLike(postId, post.userId);
    const [updatedLikes, isLiked] = await Promise.all([
      getLikesByPost(postId),
      checkUserLike(postId),
    ]);
    setLikes(updatedLikes);
    setLiked(isLiked);
  };

  if (!post) {
    return (
      <div className="w-50 m-auto mt-4 text-center text-danger">
        Post not found
      </div>
    );
  }

  return (
    <div className="w-50 bg-white m-auto mt-4 shadow p-4 flex flex-col border-radius-medium mb-4">
      <div className="flex flex-row flex-between items-start mb-4">
        <div className="flex flex-row flex-1 flex-start items-start">
          {user?.profileImg ? (
            <img
              src={`http://localhost:5050${user.profileImg}`}
              alt={user.name}
              className="profile-img-sm mr-3 pointer"
              onClick={() => navigate(`/profile/${post.userId}`)}
            />
          ) : (
            <i
              className="fa fa-user-circle color-gray-500 h1 mr-3 pointer"
              onClick={() => navigate(`/profile/${post.userId}`)}
            ></i>
          )}
          <div className="flex flex-col flex-1">
            <div className="flex flex-col">
              <span
                className="text-bold link"
                onClick={() => navigate(`/profile/${post.userId}`)}
              >
                {user?.name ?? "Loading..."}
              </span>
              <span className="color-gray-500 text-sm">
                {formatRelativeDate(post.createdAt)}
              </span>
            </div>

            <div className="mt-4 mb-4 flex flex-col">
              {post.text && (
                <div className="display-block text-box">{post.text}</div>
              )}

              {post.img && (
                <div className="mt-4">
                  <img
                    src={`http://localhost:5050${post.img}`}
                    alt={post.text || "Post image"}
                    className="w-100 border-radius-medium"
                    onClick={() => setShowImgModal(true)}
                  />
                  {showImgModal && (
                    <ImgModal
                      onClose={() => {
                        setShowImgModal(false);
                      }}
                      img={post.img}
                    />
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-row flex-between border-top border-bottom p-2">
              <div className="flex flex-row items-center">
                <div className="tooltip-container">
                  {likes.length > 0 && (
                    <span className="text-bold color-dark">{likes.length}</span>
                  )}
                  <div className="tooltip-text">
                    {likes.map((like) => (
                      <div key={like._id}>
                        {like.userId === user?._id
                          ? "You"
                          : likeUserNames[like.userId] ?? "Loading..."}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-transparent btn-icon"
                  onClick={handleToggleLike}
                >
                  <i
                    className={
                      liked
                        ? "fa-solid fa-heart color-danger"
                        : "fa-solid fa-heart"
                    }
                  />
                </button>
              </div>

              <div className="flex flex-row items-center">
                <span className="text-bold color-dark">
                  {comments.length > 0 ? comments.length : ""}
                </span>
                <button
                  className="btn btn-transparent btn-icon"
                  onClick={() => setShowComments(!showComments)}
                >
                  <i className="fa fa-comment" />
                </button>
              </div>

              <div className="flex flex-row items-center">
                <button className="btn btn-transparent btn-icon btn-disabled">
                  <i className="fa fa-share" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="dropdown">
            <button
              className="btn btn-transparent btn-icon"
              onClick={() => setShowOptions(!showOptions)}
            >
              <i className="fa fa-ellipsis-v" />
            </button>
            {showOptions && (
              <div className="dropdown-content wp-200 bg-white p-4 border-radius-medium shadow">
                <div className="flex flex-col">
                  {currentUser?._id === post.userId ? (
                    <>
                      <div
                        className="flex items-center p-3 rounded-md hover"
                        onClick={() => {
                          setEditedPost(post);
                          setShowOptions(false);
                        }}
                      >
                        <i className="fa-solid fa-pencil"></i>
                        <span className="ml-3  text-md ">Edit</span>
                      </div>

                      <div
                        className="flex items-center p-3 rounded-md hover"
                        onClick={() => {
                          setShowRemoveModal(true);
                          setShowOptions(false);
                        }}
                      >
                        <i className="fa-solid fa-trash color-danger"></i>
                        <span className="ml-3  text-md color-danger">
                          Delete
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      className="flex items-center p-3 rounded-md hover"
                      onClick={() => navigate(`/post/${post._id}`)}
                    >
                      <i className="fa-solid fa-eye"></i>
                      <span className="ml-3  text-md ">Show Post</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showComments && <Comments postId={post._id} userId={post.userId} />}
      {showRemoveModal && (
        <RemoveModal
          title="Are you sure you want to delete this post?"
          onConfirm={() => {
            deletePost(post._id);
            setShowRemoveModal(false);
          }}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
    </div>
  );
}
