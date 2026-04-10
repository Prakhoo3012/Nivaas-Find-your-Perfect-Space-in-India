import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // your backend base
});

export default API;