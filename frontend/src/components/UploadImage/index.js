import React, { useRef, useState } from "react";
import { Alert, Avatar, Button, CircularProgress, Stack, Typography } from "@mui/material";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";

const UploadImage = ({ onImageUpload }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Choose a JPG or PNG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", "mern-chatfolio");
      const response = await fetch("https://api.cloudinary.com/v1_1/mern-notes/image/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || "Image upload failed.");
      setImageUrl(result.secure_url);
      onImageUpload(result.secure_url);
    } catch (uploadError) {
      setError(uploadError.message || "Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={uploading ? <CircularProgress size={16} /> : <AddPhotoAlternateRoundedIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          sx={{ minHeight: 40, borderRadius: 3 }}
        >
          {uploading ? "Uploading…" : imageUrl ? "Change photo" : "Add a profile photo"}
        </Button>
        {imageUrl && <Avatar src={imageUrl} alt="Profile photo preview" sx={{ width: 36, height: 36 }} />}
        <Typography variant="caption" color="text.secondary">Optional · JPG or PNG · up to 5 MB</Typography>
      </Stack>
      <input ref={inputRef} hidden type="file" accept="image/png,image/jpeg" onChange={handleFileChange} />
      {error && <Alert severity="error" sx={{ py: 0, borderRadius: 2 }}>{error}</Alert>}
    </Stack>
  );
};

export default UploadImage;
