import { useEffect, useRef, useState } from "react";
import { usePostContext } from "../../contexts/PostContext";
import { useUserContext } from "../../contexts/UsersCotext";
import { BASE_URL } from "../../Api/Config";

export default function AddPost() {
  const { currentUser } = useUserContext();
  const { addPost, editedPost, updatePost } = usePostContext();

  const [postContent, setPostContent] = useState<string>("");
  const [img, setImg] = useState<File | null>(null); // new image selected
  const [preview, setPreview] = useState<string | null>(null); // image preview
  const [keepOldImage, setKeepOldImage] = useState<boolean>(true); // track if old image should remain

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editedPost) {
      setPostContent(editedPost.text);
      setImg(null); // clear any previously selected new image
      if (editedPost.img) {
        setPreview(`${BASE_URL}${editedPost.img}`);
        setKeepOldImage(true);
      } else {
        setPreview(null);
        setKeepOldImage(false);
      }
    } else {
      setPostContent("");
      setPreview(null);
      setKeepOldImage(true);
      setImg(null);
    }
  }, [editedPost]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setImg(selected);
      setPreview(URL.createObjectURL(selected));
      setKeepOldImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImg(null);
    setPreview(null);
    setKeepOldImage(false);
  };

  const handlePostSubmit = async () => {
    try {
      if (editedPost) {
        let imgToSend: File | null | undefined = undefined;
    
        if (img) imgToSend = img;
        else if (!keepOldImage) imgToSend = null;
    
        await updatePost(editedPost._id, postContent, imgToSend);
      } else {
        await addPost(postContent, img ?? undefined);
      }
    
      // ✅ Reset after successful update
      setPostContent("");
      setImg(null);
      setPreview(null);
      setKeepOldImage(true);
    } catch (err: any) {
      console.error(err);
    }
    
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-50 bg-white m-auto mt-4 shadow p-4 flex flex-col border-radius-medium">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="flex flex-row items-start">
        {currentUser?.profileImg ? (
          <img
            src={`${BASE_URL}${currentUser.profileImg}`}
            alt="Profile"
            className="profile-img-sm mr-3 mt-1"
          />
        ) : (
          <i className="fa fa-user-circle color-gray-500 h1 mr-3 mt-1"></i>
        )}

        <div className="flex flex-col flex-1">
          <div className="input flex-1 mb-4">
            <div className="flex flex-col">
              {preview && (
                <div className="image-preview-container">
                  <i
                    className="fa fa-times close-icon"
                    onClick={handleRemoveImage}
                  />
                  <img src={preview} alt="Preview" className="image-preview" />
                </div>
              )}

              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's on your mind?"
              />
            </div>
          </div>

          <div className="flex flex-row flex-between items-end">
            <div className="flex flex-row">
              <button
                className="btn btn-transparent btn-icon"
                onClick={handleImageClick}
              >
                <i className="fa fa-image color-success" />
              </button>
            </div>
            <button className="btn btn-primary" onClick={handlePostSubmit}>
              {editedPost ? "Save" : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
