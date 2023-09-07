import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";

const UploadImage = ({ onImageUpload }) => {
  // const handleFileChange = (info) => {
  //   if (info.file.type === "image/png" || info.file.type === "image/jpeg") {
  //     return;
  //   }
  //   if (info.file.status === "done") {
  //     message.success(`${info.file.name} file uploaded successfully`);
  //   } else if (info.file.status === "error") {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // };

  const customRequest = async ({ file, onSuccess, onFailure }) => {
    try {
      if (
        !file.type.includes("image/jpeg") &&
        !file.type.includes("image/png")
      ) {
        message.warning("please select a valid image");
        return;
      }
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "mern-chatfolio");
      data.append("cloud_name", "mern-notes");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/mern-notes/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const myData = await response.json();
      if (myData) {
        const { url } = myData;
        onSuccess(myData, file);
        onImageUpload(url);
        message.success("image uploaded successfully");
      }
    } catch (e) {
      onFailure("failuer");
      message.error(`error: ${e}`);
    }
  };

  return (
    <Upload customRequest={customRequest}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};
export default UploadImage;
