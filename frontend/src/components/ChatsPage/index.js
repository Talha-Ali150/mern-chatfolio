import React from "react";
import { useSelector } from "react-redux";

export default function ChatsPage() {
  const userInfo = useSelector((state) => state.user.userInfo);
  return (
    <div>
      <h1>CHats Page</h1>
      <h3>WELCOME {userInfo.name}</h3>
    </div>
  );
}
