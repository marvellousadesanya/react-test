"use client";

import React, { useState } from "react";
import {
  generateUrl,
  stageFile,
  startProcessing,
  checkStatus,
} from "../apiService";

export default function Real() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload an image 😃");
    try {
      const { url, key } = await generateUrl();
      const stageResponse = await stageFile(url, file);
      if (stageResponse) {
        const { taskId } = await startProcessing(key, "dragonfly-img-basic");
        const status = await checkStatus(taskId);
        console.log("Processing status:", status);
      } else {
        console.error("Failed to stage file correctly.");
      }
    } catch (error) {
      console.error("Error in upload process:", error);
    }
  };

  return (
    <div>
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="w-[487px] h-72 bg-white p-12 space-y-12 rounded-md">
          <input type="file" onChange={handleFileChange} />
          <button
            className="bg-blue-400 px-3 py-2 text-white rounded-md"
            onClick={handleUpload}>
            Upload and Process
          </button>
        </div>
      </div>
    </div>
  );
}
