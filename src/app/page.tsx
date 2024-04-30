"use client";

import React, { useState, ChangeEvent } from "react";
import axios from "axios";

type FileWithStatus = {
  file: File;
  taskId: string;
  fileName: string;
  status: string;
  previewUrl?: string;
};

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [tasks, setTasks] = useState<FileWithStatus[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Append new files to the existing files array
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const {
        data: { key, url },
      } = await axios.post<{ key: string; url: string }>(
        "https://staging.api.dragonflyai.co/pipeline/assets/stage",
        {},
        { headers: { Authorization: "Bearer YOUR_TOKEN" } }
      );

      const response = await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });

      if (response.status === 200) {
        const {
          data: { taskId },
        } = await axios.post<{ taskId: string }>(
          "https://staging.api.dragonflyai.co/pipeline/assets/process",
          `key=${key}&pipeline=dragonfly-img-basic`,
          {
            headers: {
              Authorization: "Bearer YOUR_TOKEN",
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        setTasks((prev) => [
          ...prev,
          { taskId, fileName: file.name, status: "Processing", file },
        ]);
      } else {
        console.error("Upload failed: ", response.status);
        alert("Upload failed! Server responded with an error.");
      }
    } catch (error) {
      console.error("Error during upload: ", error);
      alert("Upload error. Please try again later.");
    }
  };

  const checkStatus = async (taskId: string) => {
    try {
      const response = await axios.post<{ status: string }>(
        "https://staging.api.dragonflyai.co/pipeline/assets/status",
        { taskId },
        {
          headers: {
            Authorization: "Bearer YOUR_TOKEN",
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          },
        }
      );

      setTasks((prev) =>
        prev.map((task) =>
          task.taskId === taskId
            ? { ...task, status: response.data.status }
            : task
        )
      );
    } catch (error) {
      console.error("Error fetching status: ", error);
      alert("Failed to fetch status!");
    }
  };

  return (
    <div className="w-full h-screen bg-[#EFEFEF] flex items-center justify-center p-5">
      <div className="w-[512px] h-[300px] rounded-xl bg-white p-7">
        <h1 className="p-3 text-sm">
          Upload an image. We will analyze it and get you a result. 👍🏾
        </h1>
        <input type="file" multiple onChange={handleFileChange} />
        {files.map((file, index) => (
          <div key={index}>
            <p>{file.name}</p>
            <button
              className="border border-solid bg-red-400 text-white px-2 py-1 rounded-2xl"
              onClick={() => handleUpload(file)}>
              Upload and Process
            </button>
          </div>
        ))}
        {tasks.map((task, index) => (
          <div key={index}>
            <p>
              {task.fileName}: {task.status}
            </p>
            <button onClick={() => checkStatus(task.taskId)}>
              Check Status
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

// import React, { useState, ChangeEvent } from "react";
// import axios from "axios";

// type FileWithStatus = {
//   file: File;
//   taskId: string;
//   fileName: string;
//   status: string;
//   previewUrl?: string;
// };

// function App() {
//   const [files, setFiles] = useState<File[]>([]);
//   const [tasks, setTasks] = useState<FileWithStatus[]>([]);

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files) {
//       setFiles([...files, ...Array.from(event.target.files)]);
//     }
//   };

//   const handleUpload = async (file: File) => {
//     try {
//       // First grab, the key and url
//       const {
//         data: { key, url },
//       } = await axios.post<{ key: string; url: string }>(
//         "https://staging.api.dragonflyai.co/pipeline/assets/stage",
//         {},
//         { headers: { Authorization: "fa66abff-98c2-4122-8997-b767836bf956" } }
//       );

//       const response = await axios.put(url, file, {
//         headers: { "Content-Type": file.type },
//       });

//       // If the status is 200, gives go ahead to run next endpoint
//       if (response.status === 200) {
//         const processResponse = await axios.post<{ taskId: string }>(
//           "https://staging.api.dragonflyai.co/pipeline/assets/process",
//           `key=${key}&pipeline=dragonfly-img-basic`,
//           {
//             headers: {
//               Authorization: "fa66abff-98c2-4122-8997-b767836bf956",
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//           }
//         );

//         if (processResponse.data.taskId) {
//           setTasks((prev) => [
//             ...prev,
//             {
//               taskId: processResponse.data.taskId,
//               fileName: file.name,
//               status: "Processing",
//               file,
//             },
//           ]);
//         } else {
//           console.error("Failed to retrieve taskId from processing response");
//           alert("Processing failed! No task ID was provided.");
//         }
//       } else {
//         console.error(
//           "Error during file upload, server responded with:",
//           response.status
//         );
//         alert("Upload failed! Server responded with an error.");
//       }
//     } catch (error) {
//       console.error("Error during file upload:", error);
//       alert(
//         "Uh! There seems to be an error from our end. Please try again later 🙁"
//       );
//     }
//   };

//   const checkStatus = async (taskId: string) => {
//     try {
//       const response = await axios.post<{ status: string }>(
//         "https://staging.api.dragonflyai.co/pipeline/assets/status",
//         { taskId },
//         {
//           headers: {
//             Authorization: "fa66abff-98c2-4122-8997-b767836bf956",
//             "Content-Type": "application/json",
//             "Cache-Control": "no-store",
//           },
//         }
//       );

//       setTasks((prev) =>
//         prev.map((task) =>
//           task.taskId === taskId
//             ? { ...task, status: JSON.stringify(response.data) }
//             : task
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching status:", error);
//       alert("Failed to fetch status!");
//     }
//   };

//   return (
//     <div className="w-full h-screen bg-[#EFEFEF] flex items-center justify-center p-5ßß">
//       <div className="w-[512px] h-[300px] rounded-xl bg-white p-7">
//         <h1 className="p-3 text-sm">
//           Upload an image. We will analyze it and get you a result. 👍🏾
//         </h1>
//         <input type="file" multiple onChange={handleFileChange} />
//         {files.map((file, index) => (
//           <div key={index}>
//             <p>{file.name}</p>
//             <button
//               className="border border-solid bg-red-400 text-white px-2 py-1 rounded-2xl"
//               onClick={() => handleUpload(file)}>
//               Upload and Process
//             </button>
//           </div>
//         ))}
//         {tasks.map((task, index) => (
//           <div key={index}>
//             <p>
//               {task.fileName}: {task.status}
//             </p>
//             <button onClick={() => checkStatus(task.taskId)}>
//               Check Status
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
