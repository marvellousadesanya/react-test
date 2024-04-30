import axios from "axios";

const API_BASE_URL = "https://staging.api.dragonflyai.co/pipeline/assets";
const API_KEY = "fa66abff-98c2-4122-8997-b767836bf956";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: API_KEY,
  },
});

export const generateUrl = async () => {
  try {
    const response = await apiClient.post("/stage");
    return response.data;
  } catch (error) {
    console.error("Error generating URL:", error);
    alert(error);
    throw error;
  }
};

export const stageFile = async (uploadUrl: string, file: File) => {
  try {
    const response = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    // only proceed if the response is 200. Else, throw an errow
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to upload file with status: " + response.status);
    }
  } catch (error) {
    alert(error);
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const startProcessing = async (key: string, pipeline: string) => {
  try {
    const response = await apiClient.post("/process", null, {
      params: { key, pipeline },
    });
    return response.data;
  } catch (error) {
    console.error("Error starting processing:", error);
    throw error;
  }
};

export const checkStatus = async (taskId: string) => {
  try {
    const response = await apiClient.post("/status", { taskId });
    return response.data;
  } catch (error) {
    console.error("Error checking status:", error);
    throw error;
  }
};
