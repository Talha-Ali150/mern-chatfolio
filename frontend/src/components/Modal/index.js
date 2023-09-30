import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Form, Input, List, Modal, Space, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllChats } from "../../features/chatSlice";

const MyModal = () => {
  const [chatTitle, setChatTitle] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
    setFilteredData(data);
  };

  const handleOk = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    if (addedUsers.length < 2 || !chatTitle) {
      return console.log("error");
    }

    try {
      // Assuming members is an array of user IDs, replace it with the actual members you want to add to the group chat

      const members = []; // Replace with your actual member IDs
      // console.log("added users before making members", addedUsers);
      addedUsers.map((item) => {
        members.push(item.id);
      });
      // console.log("therse are members", members);

      const requestData = {
        chatTitle: chatTitle,
        members: JSON.stringify(members), // Convert members to a JSON string
      };

      const response = await axios.post(
        "http://localhost:5000/api/chat/groupChat",
        requestData,
        config
      );

      // console.log(response.data); // Assuming the response contains the created group chat details
      // window.location.reload(false);
      dispatch(getAllChats(userInfo.token));
      setIsModalOpen(false);
    } catch (e) {
      console.log(e.response.data.error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const response = await axios.get(
        "http://localhost:5000/api/chat/getUsers",
        config
      );
      setData(response.data);
      // console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
    // console.log(addedUsers);
  }, [addedUsers]);

  const handleSearch = () => {
    // Filter the data based on the search query
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(userName.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const removeUser = (userToRemove) => {
    const updatedUsers = addedUsers.filter(
      (user) => user.id !== userToRemove.id
    );
    // console.log("users after removing", updatedUsers);
    setAddedUsers(updatedUsers);
    // console.log("checking aded users ", addedUsers);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Create New Group
      </Button>
      <Modal
        title="Create New Group"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        style={{ borderRadius: 8 }}
        bodyStyle={{ padding: "20px" }}
      >
        {/* <Form> */}
        {/* <Input
            placeholder="Group Name"
            style={{ marginBottom: "10px" }}
            onChange={(e) => {
              setChatTitle(e.target.value);
            }}
            value={chatTitle}
          /> */}
        <Form className="d-flex align-items-center flex-column">
          <Input
            placeholder="Enter Chat Title"
            value={chatTitle}
            onChange={(event) => {
              setChatTitle(event.target.value);
            }}
          />
          <Input
            placeholder="Enter Names of Users"
            style={{ marginBottom: "10px" }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              handleSearch();
            }}
          />
        </Form>

        <Space size={[0, "small"]} wrap>
          {addedUsers &&
            addedUsers.map((item, index) => {
              return (
                <Tag
                  bordered={false}
                  closable
                  onClose={() => removeUser({ id: item.id })}
                  key={item.id}
                >
                  {item.name}
                </Tag>
              );
            })}
        </Space>
        <div style={{ maxHeight: "150px", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={filteredData}
            renderItem={(item, index) => (
              <List.Item
                onClick={() => {
                  if (!addedUsers.some((user) => user.name === item.name)) {
                    const temp = [...addedUsers];
                    temp.push({ name: item.name, id: item._id });
                    setAddedUsers(temp);
                  } else {
                    // console.log(`${item.name} is already added.`);
                  }
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.pic} />}
                  title={item.name}
                  description={item.email}
                />
              </List.Item>
            )}
          />
        </div>
      </Modal>
    </>
  );
};

export default MyModal;
