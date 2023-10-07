import React, { useState } from "react";
import styles from "./SignupForm.module.css";
import { Form, Input, message } from "antd";
import Button from "react-bootstrap/Button";
import UploadImage from "../UploadImage";
import axios from "axios";

const SignupForm = () => {
  const onFinish = (values) => {
    console.log("Success: signup", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const initialFormValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "https://cdn-icons-png.flaticon.com/512/847/847969.png?w=360&t=st=1691752333~exp=1691752933~hmac=49e517354d0f015b7632af5b95093ff9765104dc66369e4eb6c8b235c911225e",
  };

  const [values, setValues] = useState(initialFormValues);

  const handleImageUpload = (url) => {
    setValues({ ...values, pic: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name, confirmPassword } = values;
    try {
      if (!email || !password || !name) {
        message.warning("please fill all the fields");
      }

      const isValidEmail =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email);

      if (!isValidEmail) {
        message.warning("Please enter a valid email address");
        return;
      }

      if (password !== confirmPassword) {
        message.warning("Passwords are different");
        return;
      } else {
        const { name, email, password, pic } = values;
        await axios.post("http://localhost:5000/api/users/", {
          name: name,
          email: email,
          password: password,
          pic: pic,
        });
        message.success("Sign Up Successful!");

        window.location.reload(false);
      }
    } catch (e) {
      message.error(e.response.data.message);
    }
  };

  return (
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
      // wrapperCol={
      //   {
      //     offset: 10,
      //     span: 16,
      //   }
      // }
      >
        <div className={` container   ${styles.formBtnContainer} `}>
          <Button
            className={` ${styles.loginBtnStyling} btn-secondary`}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};
export default SignupForm;
