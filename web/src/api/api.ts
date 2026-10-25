import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 请求统一附带登录令牌
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.set("token", token);
  }
  return config;
});

// 令牌失效时清除本地登录态并回到登录页
api.interceptors.response.use(async (response) => {
  const token = localStorage.getItem("token");
  if (response.data.code === 401 && token) {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("expiresAt");
    window.location.href = "/";
    return Promise.reject(response);
  }
  return response;
});

export default api;
