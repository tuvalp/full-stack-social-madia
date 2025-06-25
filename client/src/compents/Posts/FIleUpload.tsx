import React, { useState } from "react";

export default function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected)); // For preview
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload success:", result);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && <img src={preview} alt="Preview" style={{ width: 200 }} />}
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
