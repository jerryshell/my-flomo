import { atom } from "recoil";
import Memo from "../interfaces/Memo";

// 登录态与列表状态的全局原子
export const atoms = {
  token: atom({
    key: "token",
    default: localStorage.getItem("token") || "",
  }),
  email: atom({
    key: "email",
    default: localStorage.getItem("email") || "",
  }),
  memoList: atom({
    key: "memoList",
    default: Array<Memo>(),
  }),
  memoKeyword: atom({
    key: "memoKeyword",
    default: "",
  }),
};
