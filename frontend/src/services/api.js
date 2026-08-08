import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4021",
});

export async function analyzeContract(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await API.post(
    "/analyze-contract",
    formData
  );

  return response.data;
}