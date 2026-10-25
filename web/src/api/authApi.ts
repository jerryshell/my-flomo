import { post } from "./api";
import LoginResponse from "../interfaces/LoginResponse";

const authApi = {
  login: (data: { email: string; password: string }) => {
    return post<LoginResponse>("/auth/login", data);
  },
};

export default authApi;
