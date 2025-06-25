import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AlartDropDown from "./AlartDropDown";
import UserDropDown from "./UserDropDown";
import { useActivityContext } from "../../contexts/ActivityContext";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropDown, setUserDropDown] = useState(false);
  const [alartDropDown, setAlartDropDown] = useState(false);

  const { unreadActivities } = useActivityContext();
  const toggleDropDown = (menu: string) => {
    if (menu === "user") {
      setUserDropDown(!userDropDown);
      setAlartDropDown(false);
    } else if (menu === "alart") {
      setAlartDropDown(!alartDropDown);
      setUserDropDown(false);
    } else {
      setUserDropDown(false);
      setAlartDropDown(false);
    }
  };

  useEffect(() => {
    setUserDropDown(false);
    setAlartDropDown(false);
  }, [location.pathname]); 
  
  return (
    <div className="w-100 h-7 bg-white shadow flex p-4 flex-row flex-between ">
      <div onClick={() => navigate("/")}>
        <span className="h2 color-primary pointer text-bold">Social</span>
      </div>

      <div className="flex flex-row  items-center flex-end">
        <div className="dropdown">
          <button
            className={"btn btn-transparent btn-icon"}
            onClick={() => toggleDropDown("alart")}
          >
            {unreadActivities.length > 0 && (
              <div className="activity">{unreadActivities.length}</div>
            )}
            <i className="fa fa-bell"></i>
          </button>
          {alartDropDown && <AlartDropDown />}
        </div>
        <div className="dropdown">
          <button
            className="btn btn-transparent btn-icon"
            onClick={() => toggleDropDown("user")}
          >
            <i className="fa-solid fa-user-circle"></i>
          </button>
          {userDropDown && <UserDropDown />}
        </div>
      </div>
    </div>
  );
}
