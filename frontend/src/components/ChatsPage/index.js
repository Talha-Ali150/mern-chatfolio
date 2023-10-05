import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentlyLoggedUser, userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, Skeleton, Spin } from "antd";
import { ChatList, MessageList } from "react-chat-elements";
import { getAllChats, resetChats } from "../../features/chatSlice";
import MyMessageBox from "../MyMessageBox";
import axios from "axios";
import MyModal from "../Modal/index";
import "react-chat-elements/dist/main.css";
import { io } from "socket.io-client";

export default function ChatsPage() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [userId, setUserId] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [messageData, setMessageData] = useState("");
  const [chatId, setChatId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const chatsList = useSelector((state) => state.chat.chats);
  const [fromBackend, setFromBackend] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState("");

  useEffect(() => {
    currentUserId();
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);
    newSocket.on("user typing", (data) => {
      console.log(data);
      setIsTyping(true);
    });
    newSocket.on("user stopped typing", (data) => {
      console.log(data);
      setIsTyping(false);
    });
  }, []);

  // useEffect(() => {
  //   dispatch(getAllChats(userInfo.token));
  //   if (chatId) {
  //     socket.emit("join chat", chatId);

  //     socket.on("my message", (msg) => {
  //       setMessagesList([...messagesList, msg]);
  //     });
  //     // typingIndicator();
  //   }
  // }, [messagesList]);

  // useEffect(() => {
  //   if (chatId) {
  //     socket.on("user typing", (data) => {
  //       console.log(data);
  //       // setIsTyping(true);
  //     });
  //     socket.on("user stopped typing", (data) => {
  //       console.log(data);
  //       // setIsTyping(false);
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   socket.on("user typing", (data) => {
  //     console.log(data);
  //     setIsTyping(true);
  //   });
  //   socket.on("user stopped typing", (data) => {
  //     console.log(data);
  //     setIsTyping(false);
  //   });
  // }, [messageData]);

  // useEffect(() => {

  // }, []);

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

      dispatch(setCurrentlyLoggedUser({ data: loggedUserId.data }));
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
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(getAllChats(userInfo.token));
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openChat = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const result = await axios.get(
        `http://localhost:5000/api/message/${id}`,
        config
      );
      await setMessagesList(result.data);
      console.log(messagesList);

      setChatId(id);
    } catch (e) {
      console.log(e);
    }
  };

  const sendMessage = async (message) => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const messageDetails = {
      message: message,
      chat: chatId,
    };
    try {
      const result = await axios.post(
        "http://localhost:5000/api/message/",
        messageDetails,
        config
      );
      socket.emit("new message", { room: chatId, msg: result.data });
      setMessagesList([...messagesList, result.data]);
      setMessageData("");
    } catch (e) {
      console.log(e);
    } finally {
      setMessageData("");
      setIsSending(false);
    }
  };

  // const typingIndicator = (message) => {
  //   setMessageText(message);
  //   if (message && messageText.trim() === "") {
  //     // console.log(`this is if ${messageText}`);
  //     socket.emit("stop typing", { id: chatId, user: "taz" });
  //   } else {
  //     // console.log(`this is else: ${messageText}`);
  //     socket.emit("typing", { id: chatId, user: "taz" });
  //   }
  // };

  return (
    <div className="container">
      <h1 className="text-center">Chats Page</h1>
      <h3>{fromBackend}</h3>

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
        <div className="w-100">
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
                    onClick={() => {
                      openChat(item._id);
                    }}
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="container">
          {isTyping && <p>user is typing ...</p>}
          <div
            className="mh-25 scrollable-container text-bg-info w-100"
            style={{ maxHeight: 300, overflowY: "auto" }}
          >
            <MyMessageBox messagesList={messagesList} />
          </div>
          <div className="d-flex" id="inputContainer">
            <Input
              placeholder="type something..."
              value={messageData}
              onChange={(e) => {
                // if (e.target.value.trim() === "") {
                //   socket.emit("stopped typing", chatId);
                // } else {
                //   socket.emit("typing", chatId);
                // }

                setMessageData(e.target.value);
                // typingIndicator();
              }}
              onFocus={() => {
                socket.emit("typing", {
                  id: chatId,
                  message: "user likh raha hai",
                });
                console.log("i start type");
              }}
              onBlur={() => {
                socket.emit("stopped typing", {
                  id: chatId,
                  message: "user likh raha hai",
                });
                console.log("i stop type");
              }}
            />
            {!isSending ? (
              <button
                onClick={() => {
                  sendMessage(messageData);
                  setIsSending(true);
                }}
                style={{
                  color: "white",
                  backgroundColor: "black",
                  border: "none",
                }}
              >
                Send
              </button>
            ) : (
              <Spin />
            )}
          </div>
        </div>
      </div>
      <div>
        <h1>create group section</h1>
        <MyModal />
      </div>
    </div>
  );
}
