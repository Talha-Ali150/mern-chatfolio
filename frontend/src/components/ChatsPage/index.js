import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

export default function ChatsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <div>
      <h1>CHats Page</h1>
      <h3>WELCOME {userInfo.name}</h3>
      <button
        onClick={() => {
          dispatch(userLogout());
          navigate("/");
        }}
      >
        logout
      </button>
    </div>
  );
}
