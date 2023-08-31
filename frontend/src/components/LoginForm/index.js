import React from "react";
import styles from "./LoginForm.module.css";
import { Button, Form, Input } from "antd";
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const LoginForm = () => (
  <Form
    className={styles.loginFormStyling}
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: "Please input your username!",
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: "Please input your password!",
        },
      ]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 4,
        span: 16,
      }}
    >
      <div
        className={` container d-flex justify-content-between ${styles.formBtnContainer} `}
      >
        <Button className={styles.loginBtnStyling} htmlType="submit">
          Log In
        </Button>
        <p>OR</p>
        <Button className={styles.loginBtnStyling} htmlType="submit">
          Sign Up
        </Button>
      </div>
    </Form.Item>
  </Form>
);
export default LoginForm;
