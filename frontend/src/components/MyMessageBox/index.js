import { MessageList } from "react-chat-elements";
import { useSelector } from "react-redux";

export default function MyMessageBox({ messagesList }) {
  const currentlyLoggedUserId = useSelector(
    (state) => state.user.userInfo.data
  );

  const renderMessageList = messagesList.map((item) => {
    return {
      type: "text",
      title: item.sender.name,
      text: item.message,
      position: currentlyLoggedUserId === item.sender._id ? "right" : "left",
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
    </div>
  );
}
