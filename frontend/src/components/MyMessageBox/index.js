import { MessageList } from "react-chat-elements";
import { Input } from "react-chat-elements";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function MyMessageBox() {
  const [messagesList, setMessagesList] = useState([]);
  const fetchedChatList = useSelector((state) => state.chat.chats);
  const userInfo = useSelector((state) => state.user.userInfo);
  const currentlyLoggedUserId = useSelector(
    (state) => state.user.userInfo.data
  );
  // console.log(fetchedChatList[2]);
  console.log(currentlyLoggedUserId);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const result = await axios.get(
        "http://localhost:5000/api/message/651188aceacb3e237ef38b79",
        config
      );
      await setMessagesList(result.data);
    } catch (e) {
      console.log(e);
    }
  };

  const renderMessageList = messagesList.map((item) => {
    return {
      type: "text",
      title: item.sender.name,
      text: item.message,
      position: currentlyLoggedUserId == item.sender._id ? "right" : "left",
    };
  });

  return (
    <div>
      <MessageList
        className="message-list"
        lockable={true}
        toBottomHeight={"100%"}
        dataSource={renderMessageList}
      />
      <div
        className="w-75"
        style={{ marginLeft: "10%", backgroundColor: "green" }}
      >
        <Input
          inputStyle={{
            overflow: "hidden",
            width: "100%",
            border: "1px solid",
            borderRadius: "5px",
          }}
          placeholder="Type here..."
          multiline={true}
          rightButtons={
            <button
              style={{
                color: "white",
                backgroundColor: "black",
                border: "none",
              }}
            >
              send
            </button>
          }
        />
      </div>
      <button
        onClick={() => {
          getMessages();
        }}
      >
        get all messages
      </button>
    </div>
  );
}
