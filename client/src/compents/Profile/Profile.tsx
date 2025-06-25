import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/UsersCotext";
import PostList from "../Posts/PostList";
import { usePostContext } from "../../contexts/PostContext";
import { useEffect, useRef, useState } from "react";
import type { User } from "../../types/User";
import ImgModal from "../Modals/ImgModal";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { getUserById, currentUser, updateProfileImg } = useUserContext();
  const { getPostsByUserId } = usePostContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImgModal, setShowImgModal] = useState(false);

  useEffect(() => {
    getUserById(id ?? "").then(setUser);
  }, [id, getUserById, getPostsByUserId]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const selected = e.target.files?.[0];
    if (selected) {
      if (currentUser) {
        updateProfileImg(currentUser._id, selected);
      }
    }
  };

  return (
    <>
      {showImgModal && (
        <ImgModal
          onClose={() => setShowImgModal(false)}
          img={user?.profileImg ?? ""}
        />
      )}

      <div className="w-100 bg-white shadow p-4 mb-4 flex flex-col items-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <div className="relative flex flex-center items-center">
          {user?.profileImg ? (
            <img
              className="profile-img-lg pointer"
              src={`${BASE_URL}${user?.profileImg}`}
              alt="Profile"
              onClick={() => setShowImgModal(true)}
            />
          ) : (
            <i
              className="fa fa-user-circle color-gray-500"
              style={{ fontSize: "100px" }}
            ></i>
          )}

          {id === currentUser?._id && (
            <button
              className="absolute btn"
              style={{
                bottom: "0",
                right: "0",
                width: "32px",
                height: "32px",
                minWidth: "32px",
                minHeight: "32px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ccc",
                padding: "0",
              }}
              onClick={() => handleImageClick()}
            >
              <i
                className="fa fa-camera color-gray-500"
                style={{ fontSize: "14px" }}
              ></i>
            </button>
          )}
        </div>

        <span className="h1 text-bold mt-2">{user?.name}</span>
      </div>

      <PostList>{getPostsByUserId(id ?? "")}</PostList>
    </>
  );
}
