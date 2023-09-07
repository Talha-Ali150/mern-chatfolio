import React from "react";
import { Tabs } from "antd";
import SignupForm from "../SignupForm";
import LoginForm from "../LoginForm";
const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "SIGN UP",
    children: <SignupForm />,
  },
  {
    key: "2",
    label: "LOG IN",
    children: <LoginForm />,
  },
];
const Tab = () => (
  <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
);
export default Tab;
