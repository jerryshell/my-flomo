import { post } from "./api";

const deleteMyAccountApi = {
  deleteMyAccount: () => {
    return post<null>("/deleteMyAccount");
  },
};

export default deleteMyAccountApi;
