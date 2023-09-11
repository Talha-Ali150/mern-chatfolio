import React from "react";
import { Tabs } from "antd";
import LoginForm from "../LoginForm/index";
import SignupForm from "../SignupForm/index";

import { useSelector } from "react-redux";

const Tab = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  const items = !userInfo
    ? [
        {
          key: "1",
          label: "LOG IN",
          children: <LoginForm />,
        },
        {
          key: "2",
          label: "SIGN UP",
          children: <SignupForm />,
        },
      ]
    : [
        {
          key: "2",
          label: "SIGN UP",
          children: <SignupForm />,
        },
      ];

  return <Tabs defaultActiveKey="1" items={items} />;
};
export default Tab;
