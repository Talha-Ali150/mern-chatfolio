import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ChatsPage() {
  const [searchResults, setSearchResults] = useState(false);
  const [query, setQuery] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const searchUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/api/users/?search=${query}`,
        config
      );
      console.log(response.data);
      setSearchResults(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      <div>
        <h1>Search Results</h1>
        {searchResults &&
          searchResults.map((item, index) => {
            return (
              <div className="d-flex justify-content-between">
                <span>S.No:{index}</span>
                <span>name:{item.name}</span>
                <span>email:{item.email}</span>
              </div>
            );
          })}
      </div>

      <input type="text" onChange={(e) => setQuery(e.target.value)} />
      <button onClick={searchUsers}> click me </button>
    </div>
  );
}
