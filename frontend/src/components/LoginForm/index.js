import React, { useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { Form, Input, message } from "antd";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  userLoginRequest,
  userLoginResponse,
  userLoginFailure,
} from "../../features/userSlice";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [values, setValues] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user");
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = values;
    try {
      dispatch(userLoginRequest());
      if (!email || !password) {
        console.log("Please fill all the fields");
        dispatch(userLoginFailure({ error: "please fill all the fields" }));
      } else {
        const { data } = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email,
            password,
          }
        );
        console.log("log in successful");
        const { id, name, pic, token } = data;
        dispatch(userLoginResponse({ id, name, pic, token }));
        navigate("/chat");
      }
    } catch (e) {
      console.log("error: invalid username or password");
      dispatch(userLoginFailure({ error: "invalid username or password" }));
      message.error("invalid");
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
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
        label="Email"
        name="Email"
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        value={values.email}
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="Password"
        onChange={(e) => setValues({ ...values, password: e.target.value })}
        value={values.password}
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
          offset: 10,
          span: 16,
        }}
      >
        <div
          className={` container d-flex justify-content-between ${styles.formBtnContainer} `}
        >
          <Button
            onClick={handleSubmit}
            className={` ${styles.loginBtnStyling} btn-secondary`}
            type="submit"
          >
            Log In
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
export default LoginForm;
