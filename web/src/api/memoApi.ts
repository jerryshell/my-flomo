import { get, post } from "./api";
import Memo from "../interfaces/Memo";

const memoApi = {
  list: () => {
    return get<Memo[]>("/memo/list");
  },
  create: (data: { content: string }) => {
    return post<Memo>("/memo/create", data);
  },
  update: (data: { id: string; content: string }) => {
    return post<Memo>("/memo/update", data);
  },
  deleteById: (id: string) => {
    return post<null>(`/memo/delete/id/${id}`);
  },
};

export default memoApi;
