import { get, post } from "./api";

const pluginApi = {
  getToken: () => {
    return get<string>("/plugin/getToken");
  },
  createToken: () => {
    return post<string>("/plugin/createToken");
  },
};

export default pluginApi;
