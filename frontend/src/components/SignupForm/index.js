import React, { useState } from "react";
import styles from "./SignupForm.module.css";
import { Form, Input } from "antd";
import Button from "react-bootstrap/Button";
import UploadImage from "../UploadImage";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import {
//   userLoginRequest,
//   userLoginResponse,
//   userLoginFailure,
// } from "../../features/userSlice";
// import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const onFinish = (values) => {
    console.log("Success: signup", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "https://cdn-icons-png.flaticon.com/512/847/847969.png?w=360&t=st=1691752333~exp=1691752933~hmac=49e517354d0f015b7632af5b95093ff9765104dc66369e4eb6c8b235c911225e",
  });
  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();

  const handleImageUpload = (url) => {
    setValues({ ...values, pic: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, confirmPassword } = values;
    try {
      //   dispatch(userLoginRequest());
      if (!email || !password || !name) {
        console.log("Please fill all the fields");
        // dispatch(userLoginFailure({ error: "please fill all the fields" }));
      }

      const isValidEmail =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email);

      if (!isValidEmail) {
        console.log("Please enter a valid email address");
        return;
      }

      if (password !== confirmPassword) {
        console.log("Passwords are different");
        return;
      } else {
        // const { data } = await axios.post(
        //   "http://localhost:5000/api/users/login",
        //   {
        //     email,
        //     password,
        //   }
        // );
        console.log("signUUP successful");
        console.log(values);
        // const { id, name, pic, token } = data;
        // dispatch(userLoginResponse({ id, name, pic, token }));
        // navigate("/chat");
      }
    } catch (e) {
      console.log("error signuuup: invalid username or password");
      //   dispatch(userLoginFailure({ error: "invalid username or password" }));
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
        label="Name"
        name="Name"
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        value={values.name}
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
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
        label="Confirm"
        name="Confirm"
        onChange={(e) =>
          setValues({ ...values, confirmPassword: e.target.value })
        }
        value={values.confirmPassword}
        rules={[
          {
            required: true,
            message: "Please input confirmation password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item label="Picture" name="Picture">
        <UploadImage onImageUpload={handleImageUpload} />
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
            className={` ${styles.loginBtnStyling} btn-secondary`}
            type="submit"
          >
            Sign Up
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
export default SignupForm;
