import api from "./api";

const deleteMyAccountApi = {
  deleteMyAccount: () => {
    return api.post("/deleteMyAccount");
  },
};

export default deleteMyAccountApi;
