import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "antd";
import "react-chat-elements/dist/main.css";
import { ChatList } from "react-chat-elements";

export default function ChatsPage() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [query, setQuery] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);

  const searchUsers = async () => {
    try {
      setLoading(true);
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
      setLoading(true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createChat = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const result = await axios.post(
        "http://localhost:5000/api/chat/",

        {
          //data to be sent using parameter
          userId: id,
        },
        config
      );
      console.log("success", result);
    } catch (e) {
      // message.error(e.response.data.message);
      console.log(e);
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
        <input
          type="text"
          onChange={(e) => {
            setQuery(e.target.value);
            searchUsers();
          }}
        />
        <h1>Search Results</h1>
        {loading ? (
          <Skeleton />
        ) : (
          searchResults &&
          searchResults.map((item, index) => (
            <div className="d-flex justify-content-between" key={index}>
              <ChatList
                onClick={() => {
                  createChat(item._id);
                }}
                className="chat-list"
                dataSource={[
                  {
                    avatar: item.pic,
                    alt: "avatar",
                    title: item.name,
                    subtitle:
                      "Why don't we go to the No Way Home movie this weekend ?",
                  },
                ]}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
