import { post } from "./api";

const csvApi = {
  csvImport: (data: FormData) => {
    return post<null>("/csvImport", data);
  },
};

export default csvApi;
