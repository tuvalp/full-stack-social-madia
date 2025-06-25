import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UsersCotext";

export default function UserDropDown() {
  const { currentUser, logout } = useUserContext();
  const navigate = useNavigate();

  const hendelLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="dropdown-content wp-250 bg-white p-4 border-radius-medium shadow">
      <div className="flex flex-col w-100">
        <div className="flex items-center mb-4 pb-3 border-bottom">
          {currentUser!.profileImg ? (
            <img
              src={`http://localhost:${currentUser!.profileImg}`}
              className="profile-img-sm mr-3"
            />
          ) : (
            <i className="fa fa-user-circle h1 text-gray-600 mr-3"></i>
          )}
          <div className="flex flex-col">
            <span className="text-semibold">{currentUser!.name}</span>
            <span className="text-sm color-gray-500">{currentUser!.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="flex items-center p-3 rounded-md hover"
            onClick={() => navigate(`/profile/${currentUser!._id}`)}
          >
            <i className="fa-solid fa-id-badge"></i>
            <span className="ml-3  text-md ">My Profile</span>
          </div>

          <div
            className="flex items-center p-3 rounded-md hover"
            onClick={hendelLogout}
          >
            <i className="fa-solid fa-right-to-bracket "></i>
            <span className="ml-3  text-md">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
