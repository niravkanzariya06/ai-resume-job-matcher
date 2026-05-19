import { useState } from "react";
import { api } from "../api/client";

export default function FileUpload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setLoading(true);
    try {
      const { data } = await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUploaded(data.data);
      setFile(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card card-3d" onSubmit={handleUpload}>
      <h3>Upload Resume (PDF/DOCX)</h3>
      <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button type="submit" disabled={!file || loading}>{loading ? "Uploading..." : "Upload Resume"}</button>
    </form>
  );
}
