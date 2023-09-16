import React, { useEffect, useState } from "react";
import axios from "axios";
import { Avatar, Button, Form, Input, List, Modal, Space, Tag } from "antd";
import { useSelector } from "react-redux";

const MyModal = (props) => {
  const [chatTitle, setChatTitle] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = useSelector((state) => state.user.userInfo);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
      console.log(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = () => {
    // Filter the data based on the search query
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(userName.toLowerCase())
    );

    setFilteredData(filtered);
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
        width={400} // Adjust the width as needed
        style={{ borderRadius: 8 }} // Add custom styles here
        bodyStyle={{ padding: "20px" }} // Add custom styles to the modal body
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
        <Form className="d-flex align-items-center">
          <Input
            placeholder="Enter Names of Users"
            style={{ marginBottom: "10px" }}
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              handleSearch();
            }}
          />
          {/* <button
            onClick={(e) => {
              setAddedUsers([...addedUsers, userName]);
            }}
          >
            +
          </button> */}
        </Form>

        {/* </Form> */}
        <Space size={[0, "small"]} wrap>
          {addedUsers &&
            addedUsers.map((item, index) => {
              return (
                <Tag
                  bordered={false}
                  closable
                  // onClose={() => {
                  //   const updatedUsers = addedUsers.filter(
                  //     (user, idx) => idx !== index
                  //   );
                  //   setAddedUsers(updatedUsers);
                  // }}
                  key={index}
                >
                  {item}
                </Tag>
              );
            })}
        </Space>
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <List
            itemLayout="horizontal"
            dataSource={filteredData}
            renderItem={(item, index) => (
              <List.Item
                onClick={() => {
                  setAddedUsers([...addedUsers, item.name]);
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
