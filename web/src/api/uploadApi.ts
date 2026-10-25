import { post } from "./api";

const uploadApi = {
  upload: (data: FormData) => {
    return post<null>("/upload", data);
  },
};

export default uploadApi;
