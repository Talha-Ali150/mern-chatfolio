import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "antd";
import "react-chat-elements/dist/main.css";
import { ChatList } from "react-chat-elements";
import MyModal from "../Modal";

export default function ChatsPage() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const [chats, setChats] = useState([]);

  const currentUserId = async () => {
    try {
    } catch (e) {}
  };

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

  const getChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const response = await axios.get(
        "http://localhost:5000/api/chat/",
        config
      );
      console.log(response.data);
      setChats(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">Chats Page</h1>
      <h3 className="text-center">Welcome: {userInfo.name}</h3>
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
                    subtitle: item.lastMessage,
                  },
                ]}
              />
            </div>
          ))
        )}
      </div>
      <div>
        <h1>get logged in user's all chats</h1>
        <div>
          {chats &&
            chats.map((item, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <ChatList
                    className="chat-list"
                    dataSource={[
                      {
                        avatar:
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png?w=360&t=st=1691752333~exp=1691752933~hmac=49e517354d0f015b7632af5b95093ff9765104dc66369e4eb6c8b235c911225e",
                        alt: "avatar",
                        title: item.chatTitle,
                        subtitle: item.lastMessage
                          ? item.lastMessage.message
                          : " ",
                      },
                    ]}
                  />
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <h1>create group section</h1>
        <MyModal />
      </div>
    </div>
  );
}
