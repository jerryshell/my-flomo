import { atom } from "jotai";
import Memo from "../interfaces/Memo";

// 登录态与列表状态的全局原子
export const atoms = {
  token: atom(localStorage.getItem("token") || ""),
  email: atom(localStorage.getItem("email") || ""),
  memoList: atom<Memo[]>([]),
  memoKeyword: atom(""),
};
