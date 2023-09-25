import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setCurrentlyLoggedUser, userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Skeleton } from "antd";
import "react-chat-elements/dist/main.css";
import { ChatList } from "react-chat-elements";
import MyModal from "../Modal/index";
import { getAllChats, resetChats } from "../../features/chatSlice";
import MyMessageBox from "../MyMessageBox";

export default function ChatsPage() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const chatsList = useSelector((state) => state.chat.chats);
  const [userId, setUserId] = useState("");

  const currentUserId = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      const loggedUserId = await axios.get(
        "http://localhost:5000/api/chat/getLoggedUserId",
        config
      );

      console.log("user id data", loggedUserId);
      dispatch(setCurrentlyLoggedUser(loggedUserId));
      setUserId(loggedUserId.data);
    } catch (e) {
      console.log(e);
    }
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
      console.log(e);
    } finally {
      dispatch(getAllChats(userInfo.token));
    }
  };

  // const getChats = async () => {
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${userInfo.token}`,
  //     },
  //   };

  //   try {
  //     const response = await axios.get(
  //       "http://localhost:5000/api/chat/",
  //       config
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllChats(userInfo.token));
    currentUserId();
  }, []);

  return (
    <div className="container">
      <h1 className="text-center">Chats Page</h1>
      <h3 className="text-center">Welcome: {userInfo.name}</h3>
      <button
        onClick={() => {
          dispatch(userLogout());
          dispatch(resetChats());
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
      <div className="d-flex w-100">
        {/* <h1>get logged in user's all chats</h1> */}
        <div className="w-100">
          {/* {chats && chats.length < 1 ? ( */}
          {chatsList && chatsList.length < 1 ? (
            <span>No Chats Found</span>
          ) : (
            chatsList.map((item, index) => {
              return (
                <div className="d-flex justify-content-between" key={index}>
                  <ChatList
                    className="chat-list w-75"
                    dataSource={[
                      {
                        avatar: item.groupChat
                          ? "https://cdn-icons-png.flaticon.com/512/847/847969.png?w=360&t=st=1691752333~exp=1691752933~hmac=49e517354d0f015b7632af5b95093ff9765104dc66369e4eb6c8b235c911225e"
                          : item.members
                              .filter((elem) => elem._id !== userId)
                              .map((member) => member.pic),
                        alt: "avatar",
                        title: item.chatTitle
                          ? item.chatTitle
                          : item.members
                              .filter((elem) => elem._id !== userId)
                              .map((member) => member.name),

                        subtitle: item.lastMessage
                          ? item.lastMessage.message
                          : " ",
                      },
                    ]}
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="text-bg-info w-100">
          <h1>this will be message box</h1>
          <MyMessageBox />
        </div>
      </div>
      <div>
        <h1>create group section</h1>
        <MyModal />
      </div>
    </div>
  );
}
